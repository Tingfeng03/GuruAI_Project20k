from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from datetime import datetime

from src.config import azure_model


def generate_answer(docs, question, emotion, sentiment, intent):

    llm = azure_model

    sysmsg = f"""
    """
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", sysmsg),
            ("human", "User question: {question}\n\nContext: {context}\n\nEmotion: {emotion}\n\nSentiment: {sentiment}\n\nIntention: {intent}\n\n"),
        ]
    )

    rag_chain = prompt | llm | StrOutputParser()

    generation = rag_chain.invoke({"context": docs, "question": question, "emotion": emotion, "sentiment": sentiment, "intent": intent})

    return generation