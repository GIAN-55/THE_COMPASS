from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_name: str = "Compass"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    frontend_origin: str = ""
    manual_gist_raw_url: str = ""
    indicaciones_gist_raw_url: str = ""
    groq_default_api_key: str = ""
    tavily_api_key: str = ""
    upstash_redis_url: str = ""
    upstash_redis_token: str = ""
    free_message_limit: int = 1000
    byok_message_limit: int = 5000
    free_daily_limit: int = 3
    default_groq_model: str = "llama-3.3-70b-versatile"
    docs_refresh_seconds: int = 600
    provider_timeout_seconds: float = 30.0

    @property
    def cors_origins(self) -> list[str]:
        origins = ["http://localhost:5173"]
        if self.frontend_origin:
            origins.append(self.frontend_origin)
        return origins

    @property
    def redis_configured(self) -> bool:
        return bool(self.upstash_redis_url and self.upstash_redis_token)

settings = Settings()
