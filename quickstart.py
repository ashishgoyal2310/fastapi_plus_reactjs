"""
uvicorn --port 5000 --host 127.0.0.1 quickstart:app --reload
"""
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def hello():
    return {"message":"Hello Guest! Fast API Quickstart."}