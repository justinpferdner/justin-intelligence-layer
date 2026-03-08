from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH")
DATA_PATH = os.getenv("DATA_PATH")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load profile once at startup
with open(DATA_PATH, "r") as f:
    JUSTIN_PROFILE = f.read()

SYSTEM_PROMPT = f"""
You are Justin Pferdner's personal AI assistant on his portfolio website.
Visitors are recruiters and hiring managers learning about Justin.

Here is everything you know about Justin:

{JUSTIN_PROFILE}

STRICT RULES:
- Only use information explicitly stated above
- Do not make inferences or assumptions beyond what is written
- If the answer is not in the profile, say "I don't have that information about Justin"
- Never guess at details like location, availability, or salary

RESPONSE STYLE:
- Match length to question complexity — short questions get short answers
- Only go into detail if explicitly asked
- Use bullet points when listing multiple items
- Use plain prose for single fact answers
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
def chat(request: ChatRequest) -> ChatResponse:
    # Build message history for GPT
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add conversation history
    for msg in request.history:
        messages.append({"role": msg.role, "content": msg.content})

    # Add current message
    messages.append({"role": "user", "content": request.message})

    # Call GPT with full history
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return ChatResponse(response=response.choices[0].message.content)