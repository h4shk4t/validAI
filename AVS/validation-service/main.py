from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Any
from groq import Groq
from scipy.spatial.distance import cosine
import json
import numpy as np
import os
import uvicorn
from llama_index.embeddings.openai import OpenAIEmbedding

# Load environment variables
load_dotenv()

class CustomResponse(BaseModel):
    is_approved: bool

class CustomError(BaseModel):
    detail: str
    data: Any

# Set up Groq client with environment variable
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key=os.environ["API_KEY"],
    model="text-embedding-3-large"
)

def get_embedding(text):
    return model.get_text_embedding(text)

def get_embedding(text: str):
    """Generate sentence embedding using SBERT model."""
    return model.encode(text)

async def call_groq_api(file_id, model_name):
    """Make an API call to Groq with given data."""
    try:
        chat_completion = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": "How to check if my solidity contract is safe?",
            }],
            model=model_name
        )
        response_content = chat_completion.choices[0].message.content
        print("Groq API Response:", response_content[:50] + "...")
        return response_content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API call failed: {e}")

async def validate_response(data: str, proof_of_task: str):
    """Validate response by comparing embeddings."""
    # Split first 32 characters
    file_id = proof_of_task[:32]
    model_name = proof_of_task[32:]
    embedding = get_embedding(await call_groq_api(file_id, model_name))
    # Example check: replace with actual logic
    proof_of_task = json.loads(proof_of_task)
    # if proof_of_task == "2ac9b7acde3df183fe73cf1d571847b6829dca593fb2687d47939aa1c1788b63":
    #     return True
    # Additional similarity check with cosine distance
    print("Cosine similarity:", cosine(embedding, get_embedding(proof_of_task)))
    if cosine(embedding, get_embedding(proof_of_task)) > 0.7:
        return True
    return False

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    try:
        body = await request.json()
        print(f"Request body: {json.dumps(body, indent=2)}")
    except Exception as e:
        print(f"Failed to read request body: {e}")
    response = await call_next(request)
    return response

@app.post("/task/validate")
async def validate_task(request: Request):
    rpc_body = await request.json()
    proof_of_task = rpc_body.get("proofOfTask", "")
    data = rpc_body.get("data", {})
    task_definition_id = rpc_body.get("taskDefinitionId", "")
    performer = rpc_body.get("performer", "")
    try:
        is_approved = await validate_response(data, proof_of_task)
        response = CustomResponse(is_approved=is_approved)
        return JSONResponse(status_code=status.HTTP_200_OK, content=response.dict())
    except Exception as err:
        print(f"Error: {err}")
        error_response = CustomError(detail="Validation failed", data={})
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=error_response.dict())

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4002)
