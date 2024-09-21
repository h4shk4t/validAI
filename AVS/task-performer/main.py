from dotenv import load_dotenv
from eth_account import Account
from sentence_transformers import SentenceTransformer
from web3 import Web3
from web3.auto import w3
from llama_index import Settings
from llama_index.embeddings.openai import OpenAIEmbedding

import os
import asyncio
import json
import requests

load_dotenv()

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
# Replace with your Ethereum RPC URL
rpc_base_address = "http://0.0.0.0:8545"
validation_service_address = "http://0.0.0.0:4002"

# infura_url = 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
# web3 = Web3(Web3.HTTPProvider(infura_url))

# # Ensure the connection is successful
# if not web3.isConnected():
#     print("Connection to Ethereum network failed")
# else:
#     print("Connected to Ethereum network")

# # Contract address and ABI
# contract_address = Web3.toChecksumAddress('0xYourContractAddress')
# contract_abi = [
#     {
#         "anonymous": False,
#         "inputs": [
#             {
#                 "indexed": True,
#                 "internalType": "address",
#                 "name": "sender",
#                 "type": "address"
#             },
#             {
#                 "indexed": False,
#                 "internalType": "uint256",
#                 "name": "value",
#                 "type": "uint256"
#             }
#         ],
#         "name": "DataEmitted",
#         "type": "event"
#     }
# ]

# # Create a contract instance
# contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# # Define a function for backend processing
# def perform_backend_processing(sender, value):
#     print(f"Processing data: Sender = {sender}, Value = {value}")
#     # Insert your backend logic here (e.g., database update)

# # Define the event filter (optional: specify fromBlock, toBlock)
# event_filter = contract.events.DataEmitted.createFilter(fromBlock='latest')

# # Function to handle new events
# def handle_event(event):
#     # Extract event data
#     sender = event['args']['sender']
#     value = event['args']['value']
    
#     # Print received data
#     print(f"Event received: Sender = {sender}, Value = {value}")
    
#     # Process the event data
#     perform_backend_processing(sender, value)

# # Poll for events
# def listen_for_events():
#     while True:
#         for event in event_filter.get_new_entries():
#             handle_event(event)

# if __name__ == "__main__":
#     listen_for_events()

async def main():
    print(f"Private key: {private_key}")
    print("Additional 10 second timeout for aggregator to spin up")
    increment = 0
    # while True:
    await asyncio.sleep(10)
    increment += 1
    print(f"Interval: {increment}")
    # await asyncio.sleep(5)
    response = await generate_response()
    # proof_of_task = get_embedding(response)
    proof_of_task = "2ac9b7acde3df183fe73cf1d571847b6829dca593fb2687d47939aa1c1788b63"
    print(f"Length of Proof of task: {len(proof_of_task)}")
    await send_task(proof_of_task, response, 1)

async def generate_response():
    execution_url = "http://0.0.0.0:4003"
    # Create the JSON body
    json_rpc_body = {
        "jsonrpc": "2.0",
        "method": "generate_response",
        "params": ["transaction hash here"],
        "id": 1
    }

    try:
        response = requests.post(execution_url, json=json_rpc_body)
        response.raise_for_status()
        json_response = response.json()
        proof_of_task = json_response["result"]
        return proof_of_task

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        raise e

async def send_task(proof_of_task, data, task_definition_id):
    # Initialize wallet and address
    from web3 import Web3
    from eth_account import Account
    from eth_utils import keccak, to_bytes

    # Initialize web3 and create wallet
    # private_key = "your_private_key_here"
    account = Account.from_key(private_key)
    performer_address = account.address

    # Data and message preparation
    data = Web3.to_hex(text=data)
    proof_of_task = "2ac9b7acde3df183fe73cf1d571847b6829dca593fb2687d47939aa1c1788b63"
    task_definition_id = 0  # Use the actual value you need

    # Encode the message using the appropriate ABI
    from eth_abi import encode

    message = encode(
        ["string", "bytes", "address", "uint16"], 
        [proof_of_task, to_bytes(hexstr=data), performer_address, task_definition_id]
    )

    # Hash the message
    message_hash = keccak(message)
    print("Message hash:", message_hash.hex())

    # Sign the hash with the wallet's private key
    signed_message = Account.unsafe_sign_hash(message_hash, private_key)

    # Serialized signature (r, s, v)
    signature = signed_message.signature.hex()

    json_rpc_body = {
        "jsonrpc": "2.0",
        "method": "sendTask",
        "params": [
            proof_of_task,
            data,
            task_definition_id,
            performer_address,
            "0x"+signature,
        ],
        # "proof_of_task": proof_of_task_json,
        # "data": data,
        # "task_definition_id": str(task_definition_id),
        # "performer": performer_address,
        # "signature": signature.signature.hex(),
        "id": 1
    }
    print("Sending task:", json_rpc_body)
    try:
        # Send the request to the provider
        response = requests.post(rpc_base_address, json=json_rpc_body)
        # response = requests.post(validation_service_address + "/task/validate", json=json_rpc_body)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)
        result = response.json()
        print("API response:", result)
    except requests.exceptions.RequestException as error:
        print(f"Error making API request: {error}")

# Example usage
# asyncio.run(send_task("your_proof_of_task", "your_data", your_task_definition_id))

if __name__ == "__main__":
    asyncio.run(main())