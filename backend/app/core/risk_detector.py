import re

Category = str

CATEGORIES: dict[Category, list[str]] = {
    "self_harm": [
        r"\bsuicid\w*\b",
        r"\bautolesion\w*\b",
        r"\bauto\s*lesion\w*\b",
        r"\bmatarme\b",
        r"\bquitarme\s+la\s+vida\b",
        r"\bno\s+quiero\s+vivir\b",
        r"\bcortarme\b",
        r"\bhacerme\s+da[nñ]o\b",
        r"\bsuicide\b",
        r"\bkill\s+myself\b",
        r"\bend\s+my\s+life\b",
        r"\bself[\-\s]?harm\b",
        r"\bwant\s+to\s+die\b",
        r"\bdon'?t\s+want\s+to\s+live\b",
        r"\bcut\s+myself\b",
        r"\bhurt\s+myself\b",
    ],
    "domestic_abuse": [
        r"\bviolencia\s+de\s+g[eé]nero\b",
        r"\bviolencia\s+intrafamiliar\b",
        r"\bmaltrato\s+(f[ií]sico|psicol[oó]gico)\b",
        r"\babuso\s+(sexual|f[ií]sico|psicol[oó]gico)\b",
        r"\bme\s+golpea\b",
        r"\bme\s+pega\b",
        r"\bme\s+amenaza\b",
        r"\bdomestic\s+violence\b",
        r"\bdomestic\s+abuse\b",
        r"\bphysical\s+abuse\b",
        r"\bsexual\s+abuse\b",
        r"\bhe\s+beats\s+me\b",
        r"\bshe\s+beats\s+me\b",
        r"\bmy\s+partner\s+hits\s+me\b",
    ],
    "violence_third_party": [
        r"\bmatar\s+a\s+(alguien|mi\s+\w+)\b",
        r"\bhacerle\s+da[nñ]o\s+a\s+(alguien|mi\s+\w+)\b",
        r"\bplan\s+para\s+matar\b",
        r"\bkill\s+(someone|him|her|them|my\s+\w+)\b",
        r"\bhurt\s+(someone|him|her|them)\b",
        r"\bplan\s+to\s+kill\b",
        r"\bshoot\s+(him|her|them|someone)\b",
        r"\bdisparar\s+(le|les|a)\b",
    ],
}

_COMPILED: dict[Category, list[re.Pattern[str]]] = {
    category: [re.compile(p, re.IGNORECASE) for p in patterns]
    for category, patterns in CATEGORIES.items()
}

def detect_risk(message: str) -> Category | None:
    for category, patterns in _COMPILED.items():
        if any(p.search(message) for p in patterns):
            return category
    return None

def safety_notice_text(language: str) -> str:
    if language == "en":
        return (
            "What you shared sounds serious. You deserve real support from a qualified person. "
            "If you are in danger, contact local emergency services or a crisis helpline. "
            "An AI cannot replace human care."
        )
    return (
        "Lo que compartís suena serio. Merecés apoyo real de una persona calificada. "
        "Si estás en peligro, contactá servicios de emergencia locales o una línea de crisis. "
        "Una IA no reemplaza el cuidado humano."
    )
