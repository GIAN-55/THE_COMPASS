from typing import Literal

from pydantic import BaseModel, Field, field_validator

ProviderName = Literal["default", "groq", "openai", "anthropic", "gemini", "mistral"]
Language = Literal["es", "en"]
Role = Literal["user", "assistant"]

class HistoryItem(BaseModel):
    role: Role
    content: str

class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[HistoryItem] = Field(default_factory=list)
    language: Language = "es"
    provider: ProviderName = "default"
    api_key: str | None = None
    model: str | None = None

    @field_validator("message")
    @classmethod
    def strip_message(cls, value: str) -> str:
        return value.strip()

class ChatResponse(BaseModel):
    reply: str
    safety_notice: str | None = None
