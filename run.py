#!/usr/bin/env python3
import sys
import json
import re
import base64
import urllib.request

try:
    import minify_html
except ImportError:
    print("Please install minify_html: pip install minify_html")
    exit()
FONT_FAMILY = "Nunito"
FONT_WEIGHTS = [300, 700]
FONT_ITALIC = False
class TemplateError(Exception):
    pass
def _sub(tpl: str, item: dict) -> str:
    return re.sub(r"\[\[(.*?)\]\]", lambda m, it=item: str(it.get(m.group(1), "")), tpl)
def _render_awards(awardlines, ans):
    awards = json.load(open("awards.json"))
    awardt = "\n".join(awardlines)
    for item in (x for g in awards["award_groups"] for x in g["items"]):
        ans.append(_sub(awardt, item))
def _render_projects(projectlines, ans):
    projects = json.load(open("projects.json"))
    text = "\n".join(projectlines)
    m = re.search(r"<!--!BEGIN LINKS-->(.*?)<!--!END LINKS-->", text, re.S)
    if m:
        before = text[: m.start()]
        links_tpl = m.group(1)
        after = text[m.end():]
    else:
        before, links_tpl, after = text, None, ""
    for p in projects:
        if links_tpl is not None:
            links_html = "".join(_sub(links_tpl, lk) for lk in p.get("links", []))
            rendered = before + links_html + after
        else:
            rendered = before
        ans.append(_sub(rendered, p))
def generate(cont: str) -> str:
    lines = cont.splitlines()
    ans = []
    awardlines = []
    projectlines = []
    mode = 0
    names = {1: "TEMPLATE NOTICE", 2: "AWARD", 3: "PROJECT", 4: "PROJECT LINKS"}
    for n, line in enumerate(lines, 1):
        has = lambda s: s in line
        if has("<!--!BEGIN TEMPLATE NOTICE-->"):
            if mode != 0:
                raise TemplateError(f"line {n}: unexpected BEGIN TEMPLATE NOTICE while already inside a section")
            mode = 1
            continue
        if has("<!--!END TEMPLATE NOTICE-->"):
            if mode != 1:
                raise TemplateError(f"line {n}: END TEMPLATE NOTICE without a matching BEGIN")
            mode = 0
            continue
        if has("<!--!BEGIN AWARD-->"):
            if mode != 0:
                raise TemplateError(f"line {n}: unexpected BEGIN AWARD while already inside a section")
            mode = 2
            continue
        if has("<!--!END AWARD-->"):
            if mode != 2:
                raise TemplateError(f"line {n}: END AWARD without a matching BEGIN")
            _render_awards(awardlines, ans)
            awardlines = []
            mode = 0
            continue
        if has("<!--!BEGIN PROJECT-->"):
            if mode != 0:
                raise TemplateError(f"line {n}: unexpected BEGIN PROJECT while already inside a section")
            mode = 3
            continue
        if has("<!--!BEGIN LINKS-->"):
            if mode != 3:
                raise TemplateError(f"line {n}: BEGIN LINKS must be nested inside a BEGIN PROJECT block")
            mode = 4
        elif has("<!--!END LINKS-->"):
            if mode != 4:
                raise TemplateError(f"line {n}: END LINKS without a matching BEGIN or used outside a PROJECT block")
            mode = 3
        if has("<!--!END PROJECT-->"):
            if mode != 3:
                raise TemplateError(f"line {n}: END PROJECT without a matching BEGIN")
            _render_projects(projectlines, ans)
            projectlines = []
            mode = 0
            continue
        if mode == 0:
            ans.append(line)
        elif mode == 2:
            awardlines.append(line)
        elif mode in (3, 4):
            projectlines.append(line)
    if mode != 0:
        raise TemplateError(f"unmatched BEGIN {names[mode]} at end of file (missing END)")
    return "\n".join(ans)

def _fetch_font_css() -> str:
    if FONT_ITALIC:
        styles = ";".join(f"0,{w};1,{w}" for w in FONT_WEIGHTS)
        family = f"family={FONT_FAMILY}:ital,wght@{styles}"
    else:
        styles = ";".join(str(w) for w in FONT_WEIGHTS)
        family = f"family={FONT_FAMILY}:wght@{styles}"

    url = f"https://fonts.googleapis.com/css2?{family}&display=swap"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    })
    css = urllib.request.urlopen(req).read().decode()

    sections = re.split(r'(/\*\s*\w[\w-]*\s*\*/)', css)
    latin_blocks = []
    for i, section in enumerate(sections):
        if re.match(r'/\*\s*latin\s*\*/', section):
            latin_blocks.append(sections[i + 1])

    def _embed(m):
        woff2 = urllib.request.urlopen(m.group(1)).read()
        return f'url(data:font/woff2;base64,{base64.b64encode(woff2).decode()}) format("woff2")'

    result = ""
    for block in latin_blocks:
        result += re.sub(r'url\((https://[^)]+\.woff2)\)\s*format\([\'"]woff2[\'"]\)', _embed, block)
    return result

def inline_and_minify(html: str) -> str:
    font_css = _fetch_font_css()

    css = open("index.css").read()
    css = css.replace("/* !FONT_FAMILY */", FONT_FAMILY)
    css = font_css + css
    html = html.replace('<link rel="stylesheet" href="index.css">', f"<style>{css}</style>")
    html = re.sub(r'\n?\s*<link[^>]*fonts\.googleapis\.com[^>]*>\s*', "", html)
    html = re.sub(r'\n?\s*<link[^>]*fonts\.gstatic\.com[^>]*>\s*', "", html)

    js = open("index.js").read()
    if js.strip():
        html = html.replace('<script src="index.js"></script>', f"<script>{js}</script>")
    else:
        html = re.sub(r'\n?\s*<script src="index\.js"></script>', "", html)

    return minify_html.minify(
        html,
        minify_css=True,
        minify_js=True,
        remove_processing_instructions=True,
        keep_html_and_head_opening_tags=True,
    )

if len(sys.argv) >= 2 and sys.argv[1] == "stream":
    try:
        html = generate(sys.stdin.read())
        sys.stdout.write(inline_and_minify(html))
    except TemplateError as e:
        sys.stderr.write(f"Template error: {e}\n")
        sys.exit(1)
    sys.exit()
with open("indext.html") as f:
    html = generate(f.read())

with open("index.html", "w") as f:
    f.write(inline_and_minify(html))
