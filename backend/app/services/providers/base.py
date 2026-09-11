from typing import Protocol

HistoryMessage = dict[str, str]

class ProviderClient(Protocol):
    async def complete(
        self,
        system_prompt: str,
        history: list[HistoryMessage],
        message: str,
        api_key: str,
        model: str,
    ) -> str: ...
