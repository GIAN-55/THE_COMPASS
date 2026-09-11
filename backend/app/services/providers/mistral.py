from app.services.providers.base import HistoryMessage
from app.services.providers.openai_compat import complete_openai_compat

MISTRAL_BASE = "https://api.mistral.ai/v1"

async def complete(
    system_prompt: str,
    history: list[HistoryMessage],
    message: str,
    api_key: str,
    model: str,
) -> str:
    return await complete_openai_compat(
        MISTRAL_BASE, system_prompt, history, message, api_key, model
    )
