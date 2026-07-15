#!/usr/bin/env python3
import os
import pathlib
import subprocess
import sys
import urllib.parse

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, Response

app = FastAPI()
ROOT = pathlib.Path(__file__).resolve().parent
TEMPLATE = ROOT / "indext.html"


def build_index() -> str:
    proc = subprocess.run(
        [sys.executable, "run.py", "stream"],
        input=TEMPLATE.read_text(),
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    if proc.returncode != 0:
        raise HTTPException(status_code=500, detail=proc.stderr)
    return proc.stdout


@app.get("/")
@app.get("/index.html")
def index():
    return HTMLResponse(build_index())


@app.get("/{path:path}")
def static(path: str):
    decoded = urllib.parse.unquote(path)
    target = (ROOT / decoded).resolve()
    if target != ROOT and ROOT not in target.parents:
        raise HTTPException(status_code=400, detail="invalid path")
    if not target.is_file():
        raise HTTPException(status_code=404, detail="not found")
    return FileResponse(target)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
