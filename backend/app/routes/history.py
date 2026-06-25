from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from app.database.mongodb import history_collection
from app.models.history import ScanHistoryCreate

router = APIRouter(prefix="/history", tags=["History"])


@router.post("/")
def save_scan(data: ScanHistoryCreate):

    history_doc = {
    "userId": data.userId,
    "productName": data.productName,
    "status": data.status,
    "ingredients": data.ingredients,
    "imageUrl": data.imageUrl,
    "scannedAt": datetime.utcnow(),
    }

    result = history_collection.insert_one(history_doc)

    return {"message": "Scan saved", "historyId": str(result.inserted_id)}


@router.get("/{user_id}")
def get_history(user_id: str):

    history = list(history_collection.find({"userId": user_id}).sort("scannedAt", -1))

    for item in history:
        item["_id"] = str(item["_id"])

    return history


@router.delete("/{history_id}")
def delete_history(history_id: str):

    result = history_collection.delete_one({"_id": ObjectId(history_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="History item not found")

    return {"message": "History deleted"}
