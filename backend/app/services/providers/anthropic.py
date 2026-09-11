import httpx

from app.config import settings
from app.services.providers.base import HistoryMessage

async def complete(
    system_prompt: str,
    history: list[HistoryMessage],
    message: str,
    api_key: str,
    model: str,
) -> str:
    messages = [{"role": h["role"], "content": h["content"]} for h in history]
    messages.append({"role": "user", "content": message})
    payload = {
        "model": model,
        "max_tokens": 4096,
        "system": system_prompt,
        "messages": messages,
    }
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=settings.provider_timeout_seconds) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages", json=payload, headers=headers
        )
        response.raise_for_status()
        data = response.json()
    parts = data.get("content", [])
    return "".join(part.get("text", "") for part in parts if part.get("type") == "text")
