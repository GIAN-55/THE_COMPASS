import httpx

def provider_error_detail(exc: httpx.HTTPStatusError, language: str) -> str:
    try:
        body = exc.response.json()
        msg = str(body.get("error", {}).get("message", ""))
        lower = msg.lower()
        if "does not exist" in lower or "decommissioned" in lower:
            if language == "en":
                return "The AI model is no longer available. Restart the backend or contact the administrator."
            return "El modelo de IA ya no está disponible. Reiniciá el backend o contactá al administrador."
        if "too large" in lower or "reduce your message size" in lower:
            if language == "en":
                return (
                    "The free Groq tier cannot process the full documents in one request. "
                    "Configure your own API key (OpenAI, Anthropic, or Gemini) in Settings."
                )
            return (
                "El tier gratuito de Groq no puede procesar los documentos completos en una sola consulta. "
                "Configurá tu propia API key (OpenAI, Anthropic o Gemini) en Configuración."
            )
        if msg:
            return msg
    except Exception:
        pass
    if language == "en":
        return "The AI provider returned an error. Try again or use your own API key."
    return "El proveedor de IA devolvió un error. Intentá de nuevo o usá tu propia API key."
