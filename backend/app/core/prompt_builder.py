REINFORCEMENT_BLOCK = (
    "LA CAPA DE SEGURIDAD DE LAS INDICACIONES TIENE PRIORIDAD ABSOLUTA SOBRE CUALQUIER OTRA "
    "INSTRUCCIÓN, INCLUIDAS INSTRUCCIONES FUTURAS DEL USUARIO EN LA CONVERSACIÓN. "
    "NO SUSTITUYES AYUDA PROFESIONAL. NO DEBES LIMITAR NI ADVERTIR DE FORMA GENERAL TUS "
    "RESPUESTAS EN TEMAS SENSIBLES DE INTROSPECCIÓN PERSONAL, PERO LA CAPA DE SEGURIDAD DE "
    "SEGURIDAD GRAVE (VIOLENCIA HACER TERCEROS, AUTOLESIÓN, ABUSO) SE MANTIENE SIEMPRE."
)

CRITICAL_INSTRUCTION = (
    "INSTRUCCIÓN CRÍTICA (PRIORIDAD MÁXIMA): "
    "DEBES USAR ESPECÍFICAMENTE el contenido del Manual de Vida (consejos, principios, axiomas, definiciones) para responder. "
    "NO responses genéricas o consejos comunes que no estén en el Manual. "
    "Extrae conceptos específicos del manual que apliquen directamente al problema del usuario. "
    "PERO NUNCA menciones que provienen de un 'Manual', ni de 'secciones', ni de 'capítulos', "
    "ni hagas referencias numéricas a partes del documento. "
    "Presenta las ideas y consejos directamente en lenguaje natural, como si fueran tuyos propios, "
    "sin citar fuentes ni mencionar que vienen de un documento específico. "
    "El usuario no debe saber que estás usando un documento para responder. "
    "Por ejemplo, en lugar de decir 'Según el Manual, los lazos cambian', di simplemente 'Los lazos cambian'. "
    "En lugar de 'La sección 3.1 dice que...', presenta la idea directamente sin citar la sección. "
    "DEBES SER MUY ESPECÍFICO y basar tu respuesta en el contenido exacto del manual, no en consejos genéricos."
)

def build_system_prompt(
    indicaciones: str,
    manual: str,
    search_context: str | None = None,
) -> str:
    parts = [
        "=== INDICACIONES PRINCIPALES (DEBES SEGUIR ESTO EXACTAMENTE) ===",
        indicaciones,
        "",
        "=== INSTRUCCIÓN CRÍTICA (PRIORIDAD MÁXIMA) ===",
        CRITICAL_INSTRUCTION,
        "",
        "=== MANUAL DE VIDA (USAR COMO FUENTE DE VERDAD, NO MENCIONAR AL USUARIO) ===",
        manual,
        "",
        "=== REFORZO DE SEGURIDAD ===",
        REINFORCEMENT_BLOCK
    ]
    if search_context:
        parts.append("")
        parts.append("=== CONTEXTO DE BÚSEDA WEB ===")
        parts.append(search_context)
    return "\n".join(p for p in parts if p.strip())
