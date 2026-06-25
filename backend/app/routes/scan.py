from fastapi import APIRouter, UploadFile, File
from PIL import Image
import easyocr
import numpy as np
import io
import os
from app.services.analyzer import analyze_text
import cloudinary.uploader

router = APIRouter(prefix="/scan", tags=["Scan"])

reader = easyocr.Reader(["en"])


@router.post("/")
async def scan_product(file: UploadFile = File(...)):

    print("Cloud Name:", os.getenv("CLOUDINARY_CLOUD_NAME"))
    print("API Key:", os.getenv("CLOUDINARY_API_KEY"))

    contents = await file.read()

    try:
        upload_result = cloudinary.uploader.upload(
        contents,
        folder="nutriscan"
    )

        image_url = upload_result["secure_url"]

    except Exception as e:
        print("Cloudinary Error:", e)
        raise

    image = Image.open(io.BytesIO(contents))

    image_np = np.array(image)

    results = reader.readtext(image_np, detail=0)

    extracted_text = " ".join(results)

    analysis = analyze_text(extracted_text)

    return {"imageUrl": image_url, "ocr_text": extracted_text, **analysis}
