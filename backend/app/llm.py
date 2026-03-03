from typing import Optional

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

from .config import get_settings
from .schemas import AnalyzeResponse


def _build_model(api_key: Optional[str] = None, model_name: Optional[str] = None) -> ChatGroq:
    settings = get_settings()
    key = api_key or settings.groq_api_key
    if not key:
        raise ValueError("Groq API key is not configured.")

    model = model_name or settings.groq_model
    return ChatGroq(api_key=key, model=model, temperature=0.3)


def _build_chain(api_key: Optional[str] = None, model_name: Optional[str] = None):
    parser = PydanticOutputParser(pydantic_object=AnalyzeResponse)

    prompt = ChatPromptTemplate.from_template(
        """
You are an assistant that summarizes text, determines sentiment, and selects key sentences with emojis.

Given the following input text (up to about two pages), produce:
- Exactly four concise summary lines.
- One overall sentiment: "positive", "neutral", or "negative".
- A small list of highlight sentences that best justify the sentiment, each paired with an emoji.

Return your answer as JSON matching this schema:
{format_instructions}

Input text:
\"\"\"{input_text}\"\"\"
        """.strip()
    ).partial(format_instructions=parser.get_format_instructions())

    llm = _build_model(api_key=api_key, model_name=model_name)
    return prompt | llm | parser


async def run_analysis(
    text: str, api_key: Optional[str] = None, model_name: Optional[str] = None
) -> AnalyzeResponse:
    chain = _build_chain(api_key=api_key, model_name=model_name)
    result: AnalyzeResponse = await chain.ainvoke({"input_text": text})
    # Ensure we always return exactly four lines (truncate or pad with empty strings)
    lines = list(result.summary_lines)[:4]
    while len(lines) < 4:
        lines.append("")
    result.summary_lines = lines
    return result

