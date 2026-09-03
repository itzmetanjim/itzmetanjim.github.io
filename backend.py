#!/usr/bin/env python3
# imports
from fastapi import FastAPI, Request, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from fastapi.responses import PlainTextResponse, HTMLResponse
from enum import StrEnum
import uvicorn
from dotenv import load_dotenv
load_dotenv() # load .env for api keys and whatnot
import copy
import threading
from datetime import datetime, timezone
import requests
import os
import html
import json

inboxid=os.environ.get("AGENTMAIL_INBOX_ID")
agentmailtoken=os.environ.get("AGENTMAIL_TOKEN")
cfkey=os.environ.get("CF_KEY")

# pydantic base models for endpoint inputs
class MarkType(StrEnum):
    READ = "read"
    NOTIFIED = "notified"
class SentMsg(BaseModel):
    priority: bool
    message:str
    turnstile:str
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

app = FastAPI()

# allow cors from everywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# load the web ui
webuihtml=""
with open("webui.html") as f:
    webuihtml=f.read()

# load the tokens
tokens=[]
try:
    with open("tokens") as f:
        tokens=[line.strip() for line in f.readlines()]
except Exception as e:
    print("WARNING: tokens file wasnt found. Put a file named 'tokens' in the website root directory with newline-seperated tokens. Without it, you won't be able to access protected endpoints.\n",e)

# load memory (prev msgs)
memory=dict()
if os.path.exists("memory.json") and os.path.getsize("memory.json") > 0:
    with open("memory.json") as f:
        memory=json.load(f)
else:
    memory={"messages":[],"guestbook":[]} # if it doesnt exist, initialize empty memory

def syncMemory():
    """helper function to sync the in-memory memory dict with the memory.json file"""
    global memory
    with open("memory.json","w") as f:
        json.dump(memory,f)

def latestId():
    """helper function to get the latest id"""
    global memory
    ids=list(map(lambda x:int(x["id"]),memory["messages"]))
    return max(ids) if len(ids) != 0 else 0

lock = threading.Lock() # lock to prevent race conditions
iptimes = dict() # dict to help with ratelimiting

def verify_cf(token:str)->bool:
    """helper function to verify a cf turnstile token"""
    return requests.post("https://challenges.cloudflare.com/turnstile/v0/siteverify",data={"secret":cfkey,"response":token},timeout=10).json().get("success",False) or token in tokens
    # "or token in tokens" means i can override this with an API key



@app.get("/",response_class=PlainTextResponse)
def read_root():
    """if someone visits this with a web browser they see this. also serves as docs"""
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
        turnstile:string    cloudflare turnstile token (captcha has been set up in the website)
    output:
        ok:boolean
        detail:string or nothing

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
def sendmsg(payload: SentMsg, request:Request, response: Response):
    """endpoint to send a message"""

    if payload.message=="": # dont accept empty message
        return {"ok":"false", "detail":"you tried to send an empty message."}

    global iptimes
    ip=request.client.host if request.client else "unknown"
    allow=False
    ctime=time.time()
    fxg=f"{request.headers.get("x-lily-forwarded-for")} ({ip}, {request.headers.get("x-forwarded-for")})"

    if payload.turnstile not in tokens: # dont apply ratelimiting if i am using an api key
        with lock: # prevent race since we are accessing and modifying an in memory dict
            iptimes.setdefault(fxg, []).append(time.time()) # append the current time

            for key in iptimes.keys():
                iptimes[key]=list(filter(lambda x: x>ctime-120, iptimes[key])) # clear requests before 2 mins
            iptimes={k: v for k, v in iptimes.items() if v != []} # clear empty keys

            if len(iptimes[fxg])<6:
                allow=True # if less than 6 requests in past 2 mins, allow it in
    else:
        allow=True # if im using an api key then ignore ratelimits

    if not allow: # when ratelimited:
        response.headers["Retry-After"] = "120"; # tell the thingy when to retry
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, # 429 is the correct status code
            detail="aaa you sent more than 6 messages in 2 minutes!!! take a chill pill"
        )

    if not verify_cf(payload.turnstile): # check if captcha token is valid, if its not:
       raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, # most people use 400 for captcha fail, some use 403 its just preference rlly
            detail="sorry cloudflare says you are a bot, try captcha again"
        )

    msg=dict()
    with lock: # prevent race conditions since we are going to modify memory
        msg={
            "priority":payload.priority,
            "message":payload.message,
            "ip":f"{request.headers.get("x-lily-forwarded-for")} ({ip}, {request.headers.get("x-forwarded-for")}), at {datetime.now(timezone.utc).isoformat()}",
            "id":latestId()+1,
            "read":False,
            "notified":False
        }
        memory["messages"].append(msg) # append the message to memory
        syncMemory() # sync to disk

    # sends me an email
    requests.post(f"https://api.agentmail.to/v0/inboxes/{inboxid}/messages/send",json={
        "to":"contact@tanjim.org",
        "cc":"tanjimkamal1@gmail.com",
        "subject":"New message (sent using tanjim.org), ID:"+str(msg["id"]),
        "html":f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #172b4d;max-width:900px;padding:30px">
<h1>new message</h1>
<p><strong>id</strong>:{msg["id"]}</p>
<p>from {msg["ip"]}</p>
{"""
<p><strong>high priority</strong></p>
""" if msg["priority"] else """
<p>low priority</p>
"""}
<br><br>
<p style="color:black">{html.escape(msg["message"])}</p>
</body></html>
        """
    },headers={"Authorization": f"Bearer {agentmailtoken}"})

    return {"ok":True} # yay

@app.post("/getall")
def getall(payload: TokenModel):
    """get the entire memory dict"""

    if payload.token not in tokens: # check api key
        return {"ok":False,"detail":"invalid token"}

    with lock: # we are querying an in memory dict
        global memory
        snap=copy.deepcopy(memory) # take a snapshot of the dict using deepcopy
    return snap # return the snapshot to prevent race conditions

@app.post("/new")
def new(payload: NewModel):
    """unused endpoint, filters messages by minimum id"""
    if payload.token not in tokens: # check token
        return {"ok":False,"detail":"invalid token"}

    with lock: # we are querying an in memory dict
        global memory
        snap=copy.deepcopy(memory) # take a snapshot of the dict using deepcopy

    return list(filter(lambda x:x["id"]>payload.id,snap["messages"])) # filter by id
@app.post("/mark")
def mark(payload: MarkModel):
    """change flag state of messages"""
    if payload.token not in tokens: # check api key
        return {"ok":False,"detail":"invalid token"}

    start=payload.start
    end=payload.end if payload.end is not None else payload.start # if no end given, mark just one msg

    def marker(x):
        """helper function to mark a msg"""
        if x["id"]>=start and x["id"]<=end:
            x[str(payload.type)] = payload.value
        return x

    with lock: # we are modifying an in memory dict
        memory["messages"]=list(map(marker,memory["messages"])) # mark the needed messages
        syncMemory() # sync to disk

    return {"ok":True}

@app.post("/delete")
def delete(payload: DeleteModel):
    """delete messages"""

    if payload.token not in tokens: # check api token
        return {"ok":False,"detail":"invalid token"}

    start=payload.start
    end=payload.end if payload.end is not None else payload.start # if no end given, delete just one msg

    with lock: # modifying in-memory dict
        memory["messages"]=list(filter(lambda x:not(x["id"]>=start and x["id"]<=end),memory["messages"])) # we are filtering for messages that are not supposed to be deleted which essentially deletes the needed msgs
        syncMemory() # sync to disk

    return {"ok":True}
@app.get("/webui", response_class=HTMLResponse)
def webui(token: str | None = None):
    """web ui. intended to be viewed with a browser"""

    if token not in tokens: # check the token
        return HTMLResponse(content="<!doctype html><html><body><h1>wrong token</h1> paste the token as a query param, so go to /webui?token=[token]<br> <img src='https://emoji.slack-edge.com/T09V59WQY1E/pensive-wobble/db9e72a22f481173.gif'></body></html>", status_code=401) # return a message saying its wrong if the token is wrong

    return HTMLResponse(content=webuihtml,status_code=200) # return the webui if its correct

if __name__ == "__main__": # when ran directly, start the server
    uvicorn.run("backend:app", host="127.0.0.1", port=9051, reload=True)

