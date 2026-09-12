import hashlib
from datetime import datetime, timedelta, timezone

import httpx

from app.config import settings

_memory_counts: dict[str, int] = {}

def _day_key(client_ip: str) -> str:
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    digest = hashlib.sha256(f"{client_ip}:{day}".encode()).hexdigest()
    return f"compass:free:{digest}"

def seconds_until_midnight_utc() -> int:
    now = datetime.now(timezone.utc)
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    return max(1, int((midnight - now).total_seconds()))

def reset_message(language: str) -> str:
    if language == "en":
        return (
            "Free daily limit reached (3 messages). Resets at midnight UTC. "
            "Use your own API key for unlimited access."
        )
    return (
        "Límite diario gratuito alcanzado (3 mensajes). Se reinicia a medianoche UTC. "
        "Usá tu propia API key para acceso ilimitado."
    )

async def check_and_increment(client_ip: str) -> tuple[bool, int]:
    # Skip rate limiting in local development
    if settings.is_local_dev:
        return True, 0
    
    key = _day_key(client_ip)
    limit = settings.free_daily_limit
    if settings.redis_configured:
        try:
            count = await _redis_incr(key)
            if count == 1:
                await _redis_expire(key, seconds_until_midnight_utc())
            return count <= limit, count
        except Exception:
            pass
    count = _memory_counts.get(key, 0) + 1
    _memory_counts[key] = count
    return count <= limit, count

def reset_memory_store() -> None:
    _memory_counts.clear()
