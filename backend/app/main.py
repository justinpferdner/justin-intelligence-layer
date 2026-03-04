from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# This allows your Next.js frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def root():
    return {"status": "Justin AI backend is running"}

@app.post("/chat")
def chat(request: ChatRequest) -> ChatResponse:
    # Placeholder — we'll wire up real AI here next
    return ChatResponse(response=f"You asked: {request.message}. Real AI coming soon.")