import time
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from sql_app import db, models
from routers import accounts

models.Base.metadata.create_all(bind=db.engine)


def create_fast_app():
    app = FastAPI()

    app.mount("/static", StaticFiles(directory="static"), name="static")
    templates = Jinja2Templates(directory="templates")

    @app.get("/", response_class=HTMLResponse)
    async def user_login(request: Request):
        return templates.TemplateResponse("login.html", {"request": request})

    @app.get("/ui", response_class=HTMLResponse)
    async def root(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})

    app.include_router(
        accounts.router,
        prefix="/api/accounts",
        tags=["accounts"],
    )

    @app.middleware("http")
    async def add_process_time_header(request: Request, func):
        start_time = time.time()
        response = await func(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

    return app