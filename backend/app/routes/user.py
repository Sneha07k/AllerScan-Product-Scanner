from bson import ObjectId
from fastapi import APIRouter, HTTPException
from app.database.mongodb import users_collection

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/{user_id}")
def get_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "allergies": user["allergies"],
    }
