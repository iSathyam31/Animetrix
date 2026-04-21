from functools import lru_cache

from langchain_openai import AzureChatOpenAI

from app.core.config import settings


@lru_cache
def get_llm() -> AzureChatOpenAI:
    """
    Returns a cached LangChain AzureChatOpenAI instance.
    Used by all agents across the platform.
    """
    return AzureChatOpenAI(
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
        azure_deployment=settings.AZURE_DEPLOYMENT,
        api_version=settings.AZURE_OPENAI_API_VERSION,
        api_key=settings.AZURE_OPENAI_API_KEY,
        temperature=0.7,
        streaming=True,
    )
