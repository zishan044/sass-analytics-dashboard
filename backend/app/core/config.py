from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    STRIPE_SECRET_KEY: str
    STRIPE_PRICE_ID: str
    STRIPE_WEBHOOK_SECRET: str

    FRONTEND_URL: str

    DATABASE_URL: str
    REDIS_URL: str

    DEBUG: bool

    model_config=SettingsConfigDict(env_file='.env')

settings = Settings()