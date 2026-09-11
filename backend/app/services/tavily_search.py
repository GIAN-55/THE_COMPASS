import re

import httpx

from app.config import settings

_RECENCY_PATTERNS = [
    r"\bhoy\b", r"\bayer\b", r"\besta\s+semana\b", r"\beste\s+mes\b",
    r"\bactual(?:mente)?\b", r"\b[uú]ltim\w*\s+noticias\b", r"\breciente\b",
    r"\btoday\b", r"\byesterday\b", r"\bthis\s+week\b", r"\bcurrent(?:ly)?\b",
    r"\blatest\s+news\b", r"\brecent(?:ly)?\b",
    r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
    r"\b\d{4}-\d{2}-\d{2}\b",
]
_COMPILED = [re.compile(p, re.IGNORECASE) for p in _RECENCY_PATTERNS]

def needs_search(message: str) -> bool:
    return any(p.search(message) for p in _COMPILED)

async def search_context(message: str) -> str | None:
    if not settings.tavily_api_key or not needs_search(message):
        return None
    payload = {
        "api_key": settings.tavily_api_key,
        "query": message,
        "max_results": 5,
        "search_depth": "basic",
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post("https://api.tavily.com/search", json=payload)
            response.raise_for_status()
            data = response.json()
    except Exception:
        return None
    results = data.get("results", [])[:5]
    if not results:
        return None
    lines = [
        "Resultados de búsqueda reciente, úsalos solo como contexto factual, "
        "no como parte de la filosofía del Manual:"
    ]
    for item in results:
        title = item.get("title", "")
        content = item.get("content", "")
        url = item.get("url", "")
        lines.append(f"- {title}: {content} ({url})")
    return "\n".join(lines)
