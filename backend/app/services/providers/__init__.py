from typing import Callable, Awaitable

from app.services.providers import anthropic, gemini, groq, mistral, openai
from app.services.providers.base import HistoryMessage

CompleteFn = Callable[
    [str, list[HistoryMessage], str, str, str],
    Awaitable[str],
]

PROVIDERS: dict[str, CompleteFn] = {
    "groq": groq.complete,
    "openai": openai.complete,
    "anthropic": anthropic.complete,
    "gemini": gemini.complete,
    "mistral": mistral.complete,
}

def get_provider(name: str) -> CompleteFn:
    provider = PROVIDERS.get(name)
    if not provider:
        raise ValueError(f"Unknown provider: {name}")
    return provider
