from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import MarkdownHeaderTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os
import shutil

load_dotenv()

# Path to your markdown file
DATA_PATH = os.getenv("DATA_PATH")
CHROMA_PATH = "chroma_db"

def ingest():
    # Wipe existing DB to avoid duplicates
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print("Cleared existing ChromaDB")
    
    print("Loading document...")
    loader = TextLoader(DATA_PATH)
    documents = loader.load()

    print("Splitting into chunks...")
    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "title"),
            ("##", "section"),
            ("###", "subsection"),
        ]
    )
    chunks = splitter.split_text(documents[0].page_content)

    print(f"Created {len(chunks)} chunks")
    for i, chunk in enumerate(chunks):
        print(f"  Chunk {i+1}: {chunk.metadata} — {len(chunk.page_content)} chars")

    print("Embedding and storing in ChromaDB...")
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )

    print(f"Done! {len(chunks)} chunks stored in {CHROMA_PATH}/")

if __name__ == "__main__":
    ingest()