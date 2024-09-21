from dotenv import load_dotenv
from fastapi import FastAPI, Request
from groq import Groq
from lighthouseweb3 import Lighthouse

import requests
import json
import uvicorn
import os
import io

# Replace "YOUR_API_TOKEN" with your actual Lighthouse API token
load_dotenv()
token = os.getenv("LIGHTHOUSE_KEY")
lh = Lighthouse(token)

load_dotenv()
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def call_lighthouse_api(fileID):
    try:
        file_cid = fileID
        destination_path = "./downloaded_file.txt"

        file_info = lh.download(file_cid) # The file_info is a tuple containing the file content and its metadata

        file_content = file_info[0].decode("utf-8")
        return file_content
    except:
        return file_content

async def call_groq_api(params):
    file_id = params[0]
    model_name = params[1]
    prompt = call_lighthouse_api(file_id)
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=model_name,
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
        print(params)
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
