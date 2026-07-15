#!/usr/bin/env python3
import sys
import json
import re


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
    mode = 0  # 0 top, 1 notice, 2 award, 3 project, 4 project-links
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


if len(sys.argv) >= 2 and sys.argv[1] == "stream":
    try:
        sys.stdout.write(generate(sys.stdin.read()))
    except TemplateError as e:
        sys.stderr.write(f"Template error: {e}\n")
        sys.exit(1)
    sys.exit()

with open("indext.html") as f:
    with open("index.html", "w") as F:
        F.write(generate(f.read()))
