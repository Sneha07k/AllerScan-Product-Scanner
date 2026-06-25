from pydantic import BaseModel


class AllergyRequest(BaseModel):
    userId: str
    allergy: str
