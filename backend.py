from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import PlainTextResponse, HTMLResponse
from enum import StrEnum
import uvicorn
import copy
import threading
import os
class MarkType(StrEnum):
    READ = "read"
    NOTIFIED = "notified"
class SentMsg(BaseModel):
    priority: bool
    message:str
class TokenModel(BaseModel):
    token:str
class NewModel(BaseModel):
    token:str
    id:int
class MarkModel(BaseModel):
    token:str
    start:int
    end:int | None = None
    type:MarkType
    value:bool
class DeleteModel(BaseModel):
    token:str
    start:int
    end:int | None = None
import json
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
tokens=[]
webuihtml=""
with open("webui.html") as f:
    webuihtml=f.read()
try:
    with open("tokens") as f:
        tokens=[line.strip() for line in f.readlines()]
except Exception as e:
    print("WARNING: tokens file wasnt found. Put a file named 'tokens' in the website root directory with newline-seperated tokens. Without it, you won't be able to access protected endpoints.\n",e)
memory=dict()
if os.path.exists("memory.json") and os.path.getsize("memory.json") > 0:
    with open("memory.json") as f:
        memory=json.load(f)
else:
    memory={"messages":[],"guestbook":[]}

def syncMemory():
    global memory
    with open("memory.json","w") as f:
        json.dump(memory,f)
def latestId():
    global memory
    ids=list(map(lambda x:int(x["id"]),memory["messages"]))
    return max(ids) if len(ids) != 0 else 0
lock = threading.Lock()
@app.get("/",response_class=PlainTextResponse)
def read_root():
    return """
website api
===========

API powering the website tanjim.org (or pages.tanjim.org)

MESSAGES
--------
public endpoints:

POST /sendmsg
    send a message, args:
        message:string      the message
        priority:boolean    true if high priority
    output:
        ok:boolean

protected endpoints: these all use a token argument, i did not mention them here

POST /getall
    get all messages, args:
        (none except for token)
    outputs everything
POST /new
    new unread messages, args:
        id:int              id of the message you last read
POST /mark
    mark messages, args:
        start:int
        end:int optional    if not provided, does it for one message
        type:string         "notified", "read"
        value:boolean       mark or unmark
POST /delete
    delete messages, args:
        start:int
        end:int optional    if not provided, does it for one message
GET /webui?token=<token>
    access a web UI, does not take any args uses urlsearchparams for token.

"""

@app.post("/sendmsg")
def sendmsg(payload: SentMsg, request:Request):
    ip=request.client.host
    with lock:
        memory["messages"].append({
            "priority":payload.priority,
            "message":payload.message,
            "ip":f"{request.headers.get("x-lily-forwarded-for")} ({ip}, {request.headers.get("x-forwarded-for")})",
            "id":latestId()+1,
            "read":False,
            "notified":False
        })
        syncMemory()
    return {"ok":True}
@app.post("/getall")
def getall(payload: TokenModel):
    if payload.token not in tokens:
        return {"ok":False,"detail":"invalid token"}
    with lock:
        global memory
        snap=copy.deepcopy(memory)
    return snap
@app.post("/new")
def new(payload: NewModel):
    if payload.token not in tokens:
        return {"ok":False,"detail":"invalid token"}
    with lock:
        global memory
        snap=copy.deepcopy(memory)
    return list(filter(lambda x:x["id"]>payload.id,snap["messages"]))
@app.post("/mark")
def mark(payload: MarkModel):
    if payload.token not in tokens:
        return {"ok":False,"detail":"invalid token"}
    start=payload.start
    end=payload.end if payload.end is not None else payload.start
    def marker(x):
        if x["id"]>=start and x["id"]<=end:
            x[str(payload.type)] = payload.value
        return x
    with lock:
        memory["messages"]=list(map(marker,memory["messages"]))
        syncMemory()
    return {"ok":True}

@app.post("/delete")
def delete(payload: DeleteModel):
    if payload.token not in tokens:
        return {"ok":False,"detail":"invalid token"}
    start=payload.start
    end=payload.end if payload.end is not None else payload.start
    with lock:
        memory["messages"]=list(filter(lambda x:not(x["id"]>=start and x["id"]<=end),memory["messages"]))
        syncMemory()
    return {"ok":True}
@app.get("/webui", response_class=HTMLResponse)
def webui(token: str | None = None):
    if token not in tokens:
        return HTMLResponse(content="<!doctype html><html><body><h1>wrong token</h1> paste the token as a query param, so go to /webui?token=[token]<br> <img src='https://emoji.slack-edge.com/T09V59WQY1E/pensive-wobble/db9e72a22f481173.gif'></body></html>", status_code=401)
    return HTMLResponse(content=webuihtml,status_code=200)
if __name__ == "__main__":
    uvicorn.run("backend:app", host="127.0.0.1", port=9051, reload=True)

