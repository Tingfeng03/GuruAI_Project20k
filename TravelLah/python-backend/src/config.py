from langchain_openai import AzureChatOpenAI
import os

azure_model = AzureChatOpenAI(
    api_version=os.environ['OPENAI_API_VERSION'],
    azure_endpoint=os.environ['AZURE_OPENAI_ENDPOINT'],
    api_key=os.environ['AZURE_OPENAI_API_KEY'],
    temperature=0
)