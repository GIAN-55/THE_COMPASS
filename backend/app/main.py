from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.rate_limiter import reset_memory_store
from app.routers import chat, health
from app.services import docs_loader

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Reset rate limiter memory store on startup (dev only)
    if settings.is_local_dev:
        reset_memory_store()
    await docs_loader.startup()
    yield
    await docs_loader.shutdown()

app = FastAPI(title=settings.app_name, lifespan=lifespan)
_cors: dict = {
    "allow_origins": settings.cors_origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if settings.is_local_dev:
    _cors["allow_origin_regex"] = r"http://localhost:\d+"
app.add_middleware(CORSMiddleware, **_cors)
app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
def root():
    return {"app": settings.app_name, "status": "ok"}
