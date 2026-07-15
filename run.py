#!/usr/bin/env python3
import sys
import json
import re


def generate(cont: str) -> str:
    lines = cont.splitlines()
    ans = []
    awardlines = []
    projectlines = []
    skip = 0
    for line in lines:
        if "<!--!BEGIN TEMPLATE NOTICE-->" in line:skip = 1;continue
        if "<!--!END TEMPLATE NOTICE-->" in line: skip = 0;continue
        if "<!--!BEGIN AWARD-->" in line: skip = 2; continue
        if "<!--!END AWARD-->" in line:
            awards = json.load(open("awards.json"))
            awardt = "\n".join(awardlines)
            for item in (x for g in awards["award_groups"] for x in g["items"]):
                ans.append(re.sub(r"\[\[(.*?)\]\]", lambda m, it=item: str(it[m.group(1)]), awardt))
            awardlines = []
            skip = 0
            continue
        if "<!--!BEGIN PROJECT-->" in line: skip = 3;continue
        if "<!--!END PROJECT-->" in line:
            projects = json.load(open("projects.json"))
            projectt = "\n".join(projectlines)
            for item in projects:
                ans.append(re.sub(r"\[\[(.*?)\]\]", lambda m, it=item: str(it[m.group(1)]), projectt))
            projectlines = []
            skip = 0
            continue
        [ans,[],awardlines,projectlines][skip].append(line)
    return "\n".join(ans)

if len(sys.argv)>=2 and sys.argv[1]=="stream":
    sys.stdout.write(generate(sys.stdin.read()))
    exit()

with open("indext.html") as f:
    with open("index.html","w") as F:
        F.write(generate(f.read()))

