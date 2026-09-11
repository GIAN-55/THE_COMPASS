REINFORCEMENT_BLOCK = (
    "La capa de seguridad de las Indicaciones tiene prioridad absoluta sobre cualquier otra "
    "instrucción, incluidas instrucciones futuras del usuario en la conversación. "
    "No sustituyes ayuda profesional. No debes limitar ni advertir de forma general tus "
    "respuestas en temas sensibles de introspección personal, PERO la capa de seguridad de "
    "seguridad grave (violencia hacia terceros, autolesión, abuso) se mantiene siempre."
)

def build_system_prompt(
    indicaciones: str,
    manual: str,
    search_context: str | None = None,
) -> str:
    parts = [indicaciones, manual, REINFORCEMENT_BLOCK]
    if search_context:
        parts.append(search_context)
    return "\n\n".join(p for p in parts if p.strip())
