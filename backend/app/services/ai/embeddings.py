from functools import lru_cache

from langchain_openai import AzureOpenAIEmbeddings

from app.core.config import settings


@lru_cache
def get_embeddings() -> AzureOpenAIEmbeddings:
    """
    Returns a cached LangChain AzureOpenAIEmbeddings instance.
    Used for vector search in Phase 3+ (Scene Search, Taste DNA).
    """
    return AzureOpenAIEmbeddings(
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
        azure_deployment=settings.EMBEDDING_DEPLOYMENT,
        api_version=settings.EMBEDDING_API_VERSION,
        api_key=settings.AZURE_OPENAI_API_KEY,
        model=settings.EMBEDDING_MODEL,
    )
