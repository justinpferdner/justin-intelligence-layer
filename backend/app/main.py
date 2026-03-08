from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_PATH")

app = FastAPI()

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

PROMPT_TEMPLATE = """
You are Justin Pferdner's personal AI assistant on his portfolio website.
Your job is to answer questions from recruiters and hiring managers about
Justin's experience, skills, and background.

STRICT RULES:
- Only use information explicitly stated in the context below
- Do not make inferences or assumptions beyond what is written
- Do not use information from your training data about Justin
- If the answer is not clearly in the context, say "I don't have that information about Justin"
- Never guess at details like location, availability, or salary
- Always refer to him as Justin and not Justin Pferdner

RESPONSE STYLE:
- Match length to question complexity — short questions get short answers
- "What has he done at X" should return 2-3 bullet points max, not an exhaustive list
- Only give full detail if asked "tell me everything" or "give me details"
- Use bullet points when listing multiple items
- Use plain prose for single-fact answers
- Never volunteer extra information that wasn't asked for
- Refer to Justin in the third person

Keep answers concise, professional, and friendly. Refer to Justin in the third person.

Context:
{context}

Question:
{question}
"""

@app.get("/")
def root():
    return {"status": "Justin AI backend is running"}

@app.post("/chat")
def chat(request: ChatRequest) -> ChatResponse:
    # Load the vector DB
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=embeddings
    )

    # Search for relevant chunks
    results = db.similarity_search(request.message, k=5)

    # Temporary debug - remove later
    for i, doc in enumerate(results):
        print(f"Chunk {i+1}: {doc.metadata} — {doc.page_content[:100]}")

    ### put this back up below results
    context = "\n\n".join([doc.page_content for doc in results])

    # Build the prompt
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context, question=request.message)

    # Call GPT
    llm = ChatOpenAI(model="gpt-4o-mini")
    response = llm.invoke(prompt)

    return ChatResponse(response=response.content)