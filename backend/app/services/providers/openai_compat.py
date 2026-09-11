import httpx

from app.config import settings
from app.services.providers.base import HistoryMessage

async def complete_openai_compat(
    base_url: str,
    system_prompt: str,
    history: list[HistoryMessage],
    message: str,
    api_key: str,
    model: str,
) -> str:
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend({"role": h["role"], "content": h["content"]} for h in history)
    messages.append({"role": "user", "content": message})
    payload = {"model": model, "messages": messages}
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=settings.provider_timeout_seconds) as client:
        response = await client.post(f"{base_url}/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
    return data["choices"][0]["message"]["content"]
