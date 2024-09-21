from dotenv import load_dotenv
from fastapi import FastAPI, Request
from groq import Groq

import requests
import json
import uvicorn
import os

load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

async def call_groq_api(data):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "How to check if my solidity contract is safe?",
            }
        ],
        model="llama3-8b-8192",
    )
    # Only print first 5 lines of the response
    print(chat_completion.choices[0].message.content[:50] + "...")
    return chat_completion.choices[0].message.content

app = FastAPI()

@app.post("/")
async def jsonrpc_handler(request: Request):
    req_json = await request.json()
    if req_json.get("method") == "generate_response":
        params = req_json.get("params", {})
        response = await call_groq_api(params)
        return {
            "jsonrpc": "2.0",
            "result": response,
            "id": req_json.get("id")
        }
    else:
        # Handle unsupported method names
        return {
            "jsonrpc": "2.0",
            "error": {
                "code": -32601,
                "message": "Method not found"
            },
            "id": req_json.get("id")
        }

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4003)
