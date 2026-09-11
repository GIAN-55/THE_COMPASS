import httpx

from app.config import settings
from app.services.providers.base import HistoryMessage

def _to_gemini_role(role: str) -> str:
    return "model" if role == "assistant" else "user"

async def complete(
    system_prompt: str,
    history: list[HistoryMessage],
    message: str,
    api_key: str,
    model: str,
) -> str:
    contents = []
    for item in history:
        contents.append({
            "role": _to_gemini_role(item["role"]),
            "parts": [{"text": item["content"]}],
        })
    contents.append({"role": "user", "parts": [{"text": message}]})
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": contents,
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    async with httpx.AsyncClient(timeout=settings.provider_timeout_seconds) as client:
        response = await client.post(url, params={"key": api_key}, json=payload)
        response.raise_for_status()
        data = response.json()
    candidates = data.get("candidates", [])
    if not candidates:
        raise httpx.HTTPError("Empty Gemini response")
    parts = candidates[0].get("content", {}).get("parts", [])
    return "".join(part.get("text", "") for part in parts)
