from datetime import datetime
from pydantic import BaseModel
from typing import List


class AudioURLs(BaseModel):
    url: str = None
    timestamp: datetime

class Item(BaseModel):
    id : str
    prompt: str
    prompt_timestamp: datetime
    audio_url: List[AudioURLs] = []
