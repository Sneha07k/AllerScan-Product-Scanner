from pydantic import BaseModel, EmailStr


class SendOTPRequest(BaseModel):
    email: EmailStr


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    otp: str
