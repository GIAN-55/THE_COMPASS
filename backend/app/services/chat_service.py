import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.core.model_allowlist import allowed_models_for, is_allowed
from app.core.prompt_builder import build_system_prompt
from app.core.rate_limiter import check_and_increment, reset_message
from app.core.risk_detector import detect_risk, safety_notice_text
from app.models.chat import ChatRequest, ChatResponse
from app.services import docs_loader, tavily_search
from app.services.providers import get_provider

class ChatServiceError(HTTPException):
    pass

def _is_free_mode(request: ChatRequest) -> bool:
    return request.provider == "default" or not request.api_key

def _validate_request(request: ChatRequest) -> tuple[str, str, str]:
    free_mode = _is_free_mode(request)
    limit = settings.free_message_limit if free_mode else settings.byok_message_limit
    if len(request.message) > limit:
        detail = (
            f"Message exceeds {limit} character limit for "
            f"{'free' if free_mode else 'BYOK'} mode."
        )
        raise ChatServiceError(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
    if free_mode:
        if not settings.groq_default_api_key:
            raise ChatServiceError(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Free mode is not configured on the server.",
            )
        return "groq", settings.groq_default_api_key, settings.default_groq_model
    if not request.model:
        raise ChatServiceError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Model is required when using your own API key.",
        )
    provider = request.provider
    if provider == "default":
        provider = "groq"
    if not is_allowed(provider, request.model):
        allowed = allowed_models_for(provider)
        raise ChatServiceError(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Model not allowed. Allowed for {provider}: {', '.join(allowed)}",
        )
    return provider, request.api_key, request.model

async def process_chat(request: ChatRequest, client_ip: str) -> ChatResponse:
    free_mode = _is_free_mode(request)
    if free_mode:
        allowed, _count = await check_and_increment(client_ip)
        if not allowed:
            raise ChatServiceError(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=reset_message(request.language),
            )
    provider_name, api_key, model = _validate_request(request)
    await docs_loader.ensure_fresh()
    risk = detect_risk(request.message)
    safety_notice = safety_notice_text(request.language) if risk else None
    search_block = await tavily_search.search_context(request.message)
    system_prompt = build_system_prompt(
        docs_loader.get_indicaciones(),
        docs_loader.get_manual(),
        search_block,
    )
    history = [{"role": item.role, "content": item.content} for item in request.history]
    try:
        provider = get_provider(provider_name)
        reply = await provider(system_prompt, history, request.message, api_key, model)
    except httpx.HTTPStatusError as exc:
        raise ChatServiceError(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider returned an error (HTTP {exc.response.status_code}).",
        ) from exc
    except httpx.HTTPError as exc:
        raise ChatServiceError(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not reach the AI provider. Try again later.",
        ) from exc
    except Exception as exc:
        raise ChatServiceError(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider request failed.",
        ) from exc
    return ChatResponse(reply=reply, safety_notice=safety_notice)
