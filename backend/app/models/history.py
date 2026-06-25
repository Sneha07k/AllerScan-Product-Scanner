from typing import List
from pydantic import BaseModel

class ScanHistoryCreate(BaseModel):
    userId: str
    productName: str
    status: str
    ingredients: list[str]
    imageUrl: str
