from fastapi import FastAPI, File, UploadFile, BackgroundTasks, Depends
from bson import json_util
import json
from db import close_mongo_connection, connect_to_mongo
from config import LEN_AUDIO_URL
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

from model import Item, AudioURLs
from db import get_db, get_database
from fastapi.middleware.cors import CORSMiddleware
from s3 import create_presigned_url
from uuid import uuid4
app = FastAPI()

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# upload prompts
# download (json)
# get prompt
# upload audio

app.add_event_handler('startup', connect_to_mongo)
app.add_event_handler('shutdown', close_mongo_connection)


@app.get("/get_prompt")
async def get_prompt():
    # Randomly get a prompt from the db with len(audio_url)<1
    cursor  =  get_db()['TextAudio'].aggregate([ { '$sample': { 'size': 1 } }]) #aggregate([ { '$match': { 'audio_url': {'$size':{'$lt':LEN_AUDIO_URL}} } }, { '$sample': { 'size': 1 } }])
    async for doc in cursor:
        res = json.loads(json_util.dumps(doc))
    return res
@app.get("/presigned_s3_post/{id}")
async def presigned_s3_post(id):
    # gets a presigned url (put) from s3.py and send it to client
    return create_presigned_url(id)

@app.post("/upload_audio_url/{id}")
async def upload_audio_url(id):
    # append the audio_url, takes in the ID and Audio_URL (S3)
    return 1

def save_to_db(item: Item):
	"""
	saves the items to mongo db
	returns: None
	"""
	# await get_db()['questions'].insert_one(question.dict())
	get_db()['TextAudio'].insert_one(item)

def db_populate(f, db:AsyncIOMotorClient=Depends(get_database)):
    contents = f.decode('utf-8').split('\n')
    for i in range(len(contents)):
        item_out = Item(
            id=str(uuid4()),
            prompt= str(contents[i]),
            prompt_timestamp=datetime.now()
        )
        save_to_db(item_out.dict())

@app.post('/file_upload')
async def file_upload(file: UploadFile, bt:BackgroundTasks):
    # append the audio_url, takes in the ID and Audio_URL (S3)
    # use bt to process and populate data
    f = await file.read()
    bt.add_task(db_populate(f))
    return {"message": f"{file.filename} sent for processing and DB upload"}