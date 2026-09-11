import asyncio
import logging
import time

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

_manual: str = ""
_indicaciones: str = ""
_last_refresh: float = 0.0
_refresh_task: asyncio.Task | None = None

def get_manual() -> str:
    return _manual

def get_indicaciones() -> str:
    return _indicaciones

def docs_ready() -> bool:
    return bool(_manual and _indicaciones)

async def _fetch_url(url: str) -> str | None:
    if not url:
        return None
    async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.text

async def refresh_docs(force: bool = False) -> None:
    global _manual, _indicaciones, _last_refresh
    now = time.monotonic()
    if not force and _last_refresh and (now - _last_refresh) < settings.docs_refresh_seconds:
        return
    manual_url = settings.manual_gist_raw_url
    indicaciones_url = settings.indicaciones_gist_raw_url
    try:
        manual_text, indicaciones_text = await asyncio.gather(
            _fetch_url(manual_url),
            _fetch_url(indicaciones_url),
            return_exceptions=True,
        )
        if isinstance(manual_text, Exception):
            logger.warning("Failed to load manual document")
        elif manual_text:
            _manual = manual_text
        if isinstance(indicaciones_text, Exception):
            logger.warning("Failed to load indicaciones document")
        elif indicaciones_text:
            _indicaciones = indicaciones_text
        _last_refresh = now
    except Exception:
        logger.warning("Document refresh failed")

async def _refresh_loop() -> None:
    while True:
        await asyncio.sleep(settings.docs_refresh_seconds)
        try:
            await refresh_docs(force=True)
        except Exception:
            logger.warning("Background document refresh failed")

async def startup() -> None:
    global _refresh_task
    await refresh_docs(force=True)
    _refresh_task = asyncio.create_task(_refresh_loop())

async def shutdown() -> None:
    global _refresh_task
    if _refresh_task:
        _refresh_task.cancel()
        try:
            await _refresh_task
        except asyncio.CancelledError:
            pass
        _refresh_task = None

async def ensure_fresh() -> None:
    if time.monotonic() - _last_refresh >= settings.docs_refresh_seconds:
        try:
            await refresh_docs(force=True)
        except Exception:
            pass
