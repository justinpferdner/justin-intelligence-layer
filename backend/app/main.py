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
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "justin_profile.md")

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
Today's date is {date.today().strftime("%B %d, %Y")}.
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