from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import llm
from app.routes import auth, scan, user, allergies,history
# from app.routes import
from app.config import cloudinary_config

# from app.routes.history import router as history_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(scan.router)
app.include_router(llm.router)
app.include_router(allergies.router)
app.include_router(history.router)


@app.get("/")
def home():
    return {"message": "AllerScan API running"}
