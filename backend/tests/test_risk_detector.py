from app.core.risk_detector import detect_risk, safety_notice_text

def test_detects_self_harm_spanish():
    assert detect_risk("A veces pienso en suicidarme") == "self_harm"

def test_detects_self_harm_english():
    assert detect_risk("I want to kill myself") == "self_harm"

def test_detects_domestic_abuse():
    assert detect_risk("Mi pareja me golpea y tengo miedo") == "domestic_abuse"

def test_detects_violence_third_party():
    assert detect_risk("I have a plan to kill someone") == "violence_third_party"

def test_no_risk_on_benign_message():
    assert detect_risk("Hoy reflexiono sobre mi propósito de vida") is None

def test_safety_notice_not_empty():
    assert "IA" in safety_notice_text("es")
    assert "AI" in safety_notice_text("en")
