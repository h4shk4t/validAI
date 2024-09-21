from dotenv import load_dotenv
from eth_account import Account
from sentence_transformers import SentenceTransformer
from web3 import Web3
from web3.auto import w3
from llama_index.embeddings.openai import OpenAIEmbedding

import os
import asyncio
import json
import requests
from flask import Flask, request, jsonify

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Load the pre-trained SBERT model
# Set OpenAI embedding model settings
model = OpenAIEmbedding(
    api_base="https://api.red-pill.ai/v1",
    api_key=os.environ["API_KEY"],
    model="text-embedding-3-large"
)

def get_embedding(text):
    return model.get_text_embedding(text)

# Read the private key from the environment variable
private_key = os.environ.get("PRIVATE_KEY")
rpc_base_address = "http://0.0.0.0:8545"
validation_service_address = "http://0.0.0.0:4002"

async def main(fileID, model_name):
    print(f"Private key: {private_key}")
    print("Additional 10 second timeout for aggregator to spin up")
    increment = 0
    # await asyncio.sleep(10)
    increment += 1
    print(f"Interval: {increment}")
    response = await generate_response(fileID, model_name)
    proof_of_task = get_embedding(response)
    print(f"Length of Proof of task: {len(proof_of_task)}")
    await send_task(proof_of_task, fileID, model_name, 1)

async def generate_response(fileID, model_name):
    execution_url = "http://0.0.0.0:4003"
    json_rpc_body = {
        "jsonrpc": "2.0",
        "method": "generate_response",
        "params": [fileID, model_name],
        "id": 1
    }
    try:
        response = requests.post(execution_url, json=json_rpc_body)
        response.raise_for_status()
        json_response = response.json()
        response = json_response["result"]
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        raise e

async def send_task(proof_of_task, fileID, model_name, task_definition_id):
    account = Account.from_key(private_key)
    performer_address = account.address
    data = fileID + model_name
    data = Web3.to_hex(text=data)
    proof_of_task = str(proof_of_task)
    # proof_of_task = "2ac9b7acde3df183fe73cf1d571847b6829dca593fb2687d47939aa1c1788b63"
    task_definition_id = 0

    from eth_abi import encode
    message = encode(
        ["string", "bytes", "address", "uint16"], 
        [proof_of_task, Web3.to_bytes(hexstr=data), performer_address, task_definition_id]
    )
    message_hash = Web3.keccak(message)
    signed_message = Account.unsafe_sign_hash(message_hash, private_key)
    signature = signed_message.signature.hex()

    json_rpc_body = {
        "jsonrpc": "2.0",
        "method": "sendTask",
        "params": [
            proof_of_task,
            data,
            task_definition_id,
            performer_address,
            "0x" + signature,
        ],
        "id": 1
    }
    print("Sending task:", json_rpc_body)
    try:
        response = requests.post(rpc_base_address, json=json_rpc_body)
        response.raise_for_status()
        result = response.json()
        print("API response:", result)
    except requests.exceptions.RequestException as error:
        print(f"Error making API request: {error}")

@app.route('/process', methods=['POST'])
def process_request():
    try:
        data = request.get_json()
        file_id = data.get('file_id')
        model_name = data.get('model_name')
        if not file_id or not model_name:
            return jsonify({"error": "Missing fileID or model_name"}), 400

        asyncio.run(main(file_id, model_name))
        return jsonify({"status": "Processing started"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
