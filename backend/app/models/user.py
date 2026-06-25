from pydantic import BaseModel
from typing import List


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    allergies: List[str]
