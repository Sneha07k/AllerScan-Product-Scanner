from datetime import datetime, timedelta
import os
import random

from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
# import resend

from app.database.mongodb import users_collection, otp_collection
from app.models.login import LoginRequest
from app.models.auth import RegisterRequest, SendOTPRequest
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/auth", tags=["Auth"])


# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


@router.post("/send-otp")
def send_otp(data: SendOTPRequest):

    existing_user = users_collection.find_one({"email": data.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = str(random.randint(100000, 999999))

    otp_collection.delete_many({"email": data.email})

    otp_collection.insert_one(
        {"email": data.email, "otp": otp, "createdAt": datetime.utcnow()}
    )

    try:
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASSWORD")

        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = data.email
        message["Subject"] = "AllerScan Verification Code"

        body = f"""
        <h2>Your OTP is:</h2>
        <h1>{otp}</h1>
        <p>Expires in 5 minutes.</p>
        """

        message.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)

    except Exception as e:
        print("EMAIL ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to send OTP")

    return {"message": "OTP sent successfully"}


@router.post("/signup")
def register(data: RegisterRequest):

    existing_user = users_collection.find_one({"email": data.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp_doc = otp_collection.find_one({"email": data.email})

    if not otp_doc:
        raise HTTPException(status_code=400, detail="OTP not found")

    if otp_doc["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() - otp_doc["createdAt"] > timedelta(minutes=5):
        raise HTTPException(status_code=400, detail="OTP expired")

    hashed_password = pwd_context.hash(data.password)

    result = users_collection.insert_one(
        {
            "name": data.name,
            "email": data.email,
            "password": hashed_password,
            "allergies": [],
        }
    )

    otp_collection.delete_one({"email": data.email})

    return {
        "message": "Account created successfully",
        "userId": str(result.inserted_id),
    }


@router.post("/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "userId": str(user["_id"]),
        "allergies": user["allergies"],
    }
