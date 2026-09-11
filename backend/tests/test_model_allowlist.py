from app.core.model_allowlist import allowed_models_for, allowed_providers, is_allowed

def test_allows_whitelisted_groq_model():
    assert is_allowed("groq", "openai/gpt-oss-120b") is True

def test_allows_whitelisted_openai_model():
    assert is_allowed("openai", "gpt-4o") is True

def test_rejects_unknown_model():
    assert is_allowed("openai", "gpt-3.5-turbo") is False

def test_rejects_wrong_provider_for_model():
    assert is_allowed("groq", "gpt-4o") is False

def test_allowed_models_for_provider():
    models = allowed_models_for("gemini")
    assert "gemini-2.0-flash" in models
    assert "gemini-1.5-pro" in models

def test_allowed_providers_list():
    providers = allowed_providers()
    assert "groq" in providers
    assert "anthropic" in providers
    assert "default" not in providers
