from fastapi import APIRouter, HTTPException

from app.models.llm import (
    IngredientRequest,
    ProductQuestionRequest,
)

from app.services.groq_service import ask_groq

router = APIRouter(
    prefix="/llm",
    tags=["LLM"],
)


@router.post("/ingredient-explanation")
async def ingredient_explanation(data: IngredientRequest):
    try:
        prompt = (
            f"Explain the following food ingredient in 2-3 simple sentences.\n\n"
            f"Ingredient: {data.ingredient}\n\n"
            f"Keep the explanation beginner friendly."
        )

        explanation = ask_groq(prompt)

        return {
            "ingredient": data.ingredient,
            "explanation": explanation,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.post("/ask-product")
async def ask_product(data: ProductQuestionRequest):
    try:
        prompt = (
            "You are a food product analysis assistant.\n\n"
            "You may ONLY answer questions about:\n"
            "- ingredients\n"
            "- allergens\n"
            "- nutrition\n"
            "- calories\n"
            "- dietary suitability\n"
            "- health implications of the scanned product\n\n"
            "If the user asks anything unrelated, reply exactly:\n"
            "'I can only answer questions related to this product and its nutritional information.'\n\n"
            "'The answer should not be very long make sure to give the conclusion of the question first followed by the information supporting it.'\n\n"
            f"OCR Text:\n{data.ocr_text}\n\n"
            f"Ingredients:\n{data.ingredients}\n\n"
            f"Nutrition:\n{data.nutrition}\n\n"
            f"Question:\n{data.question}"
        )

        answer = ask_groq(prompt)

        return {
            "question": data.question,
            "answer": answer,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
