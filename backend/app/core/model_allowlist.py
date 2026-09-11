from dataclasses import dataclass

@dataclass(frozen=True)
class ModelEntry:
    provider: str
    model: str
    context_tokens: int

ALLOWLIST: tuple[ModelEntry, ...] = (
    ModelEntry("groq", "openai/gpt-oss-120b", 128_000),
    ModelEntry("openai", "gpt-4o", 128_000),
    ModelEntry("openai", "gpt-4o-mini", 128_000),
    ModelEntry("openai", "gpt-4.1", 128_000),
    ModelEntry("openai", "gpt-4.1-mini", 128_000),
    # verificar string de modelo vigente en la documentación del proveedor antes de producción
    ModelEntry("anthropic", "claude-sonnet-4-5", 200_000),
    ModelEntry("anthropic", "claude-haiku-4-5", 200_000),
    ModelEntry("gemini", "gemini-2.0-flash", 1_000_000),
    ModelEntry("gemini", "gemini-1.5-pro", 1_000_000),
    ModelEntry("mistral", "mistral-large-latest", 128_000),
)

def is_allowed(provider: str, model: str) -> bool:
    return any(e.provider == provider and e.model == model for e in ALLOWLIST)

def allowed_models_for(provider: str) -> list[str]:
    return [e.model for e in ALLOWLIST if e.provider == provider]

def allowed_providers() -> list[str]:
    return sorted({e.provider for e in ALLOWLIST})
