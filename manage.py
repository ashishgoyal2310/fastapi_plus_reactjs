import uvicorn
from main import create_fast_app

app = create_fast_app()

if __name__ == "__main__":
    uvicorn.run("manage:app", host="127.0.0.1", port=8000, reload=True, log_level="info")