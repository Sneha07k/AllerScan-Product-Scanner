from pydantic import BaseModel


class IngredientRequest(BaseModel):
    ingredient: str


class ProductQuestionRequest(BaseModel):
    question: str
    ocr_text: str
    ingredients: list
    nutrition: dict
