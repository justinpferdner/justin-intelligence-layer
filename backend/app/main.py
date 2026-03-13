from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os
from datetime import date
# for streaming
from fastapi.responses import StreamingResponse

# RAG components, used in ingest.py. leaving here for V2
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "justin_profile.md")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load profile once at startup
with open(DATA_PATH, "r") as f:
    JUSTIN_PROFILE = f.read()

SYSTEM_PROMPT = f"""
You are Justin Pferdner's personal AI assistant on his portfolio website.
Today's date is {date.today().strftime("%B %d, %Y")}.
Visitors are recruiters and hiring managers learning about Justin.

Here is everything you know about Justin:

{JUSTIN_PROFILE}

STRICT RULES:
- Use all information in the profile to answer questions thoroughly
- You CAN connect related information across sections to answer questions
- You CAN make reasonable assessments based on the profile
- You CANNOT add details, capabilities, or context that are not explicitly in the profile
- If a project or experience is not related to the question, do not include it
- Do not invent specific facts, technologies, or methods that aren't mentioned
- Never guess at personal details like location, availability, or salary

RESPONSE STYLE:
- Match response length and detail to what was actually asked
- Simple factual questions get a single sentence answer
- "What did he do at X" and "Tell me about his experience" gets 3-4 bullet points of the most important things
- "What are his skills" gets a clean bullet list
- Only give exhaustive detail if the user says "tell me everything" or "give me full details"
- Never volunteer extra information that wasn't asked for
- Refer to Justin in the third person
"""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str

client = OpenAI()

@app.get("/")
def root():
    return {"status": "Justin AI backend is running"}

@app.post("/chat")
def chat(request: ChatRequest):
    # Build message history for GPT
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})

    messages.append({"role": "user", "content": request.message})

    def stream():
        with client.chat.completions.stream(
            model="gpt-4o-mini",
            messages=messages
        ) as s:
            for chunk in s:
                if chunk.type == "content.delta":
                    yield chunk.delta

    return StreamingResponse(stream(), media_type="text/plain")