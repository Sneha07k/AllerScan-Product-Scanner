from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["allerscan"]
users_collection = db["users"]
history_collection = db["scan_history"]
otp_collection = db["otp"]
