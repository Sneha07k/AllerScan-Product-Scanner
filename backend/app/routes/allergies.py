from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.models.allergies import AllergyRequest
from app.database.mongodb import users_collection


router = APIRouter(prefix="/allergies", tags=["Allergies"])


@router.get("/{user_id}")
def get_allergies(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"allergies": user.get("allergies", [])}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def add_allergy(data: AllergyRequest):
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(data.userId)},
            {"$addToSet": {"allergies": data.allergy}},
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "Allergy added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
def remove_allergy(data: AllergyRequest):
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(data.userId)},
            {"$pull": {"allergies": data.allergy}},
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "Allergy removed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
