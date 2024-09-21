from py_near import NearAsync, providers
import asyncio
from py_near.account import Account

# Configure NEAR connection to testnet or mainnet
near = NearAsync(providers.JsonRpcProvider('https://rpc.testnet.near.org'))

async def check_event(tx_hash, account_id):
    result = await near.providers.tx_status(tx_hash, account_id)
    logs = result['receipts_outcome'][0]['outcome']['logs']
    return logs

async def make_method_call(account_id, private_key, contract_id, method, args):
    # Initialize the account
    account = Account(near, account_id, private_key)

    # Call the contract method
    result = await account.call_function(
        contract_id=contract_id,
        method_name=method,
        args=args,
        gas=300_000_000_000_000,  # specify gas units
        deposit=0  # specify NEAR tokens to attach
    )
    return result

async def monitor_and_respond(tx_hash, account_id, private_key, contract_id, method, args):
    # Monitor transaction for emitted event
    logs = await check_event(tx_hash, account_id)
    
    # Check if the log contains the desired event
    if any('YourEventName' in log for log in logs):
        # Trigger the contract method call
        result = await make_method_call(account_id, private_key, contract_id, method, args)
        print(f"Method call result: {result}")
    else:
        print("Event not found in logs.")


async def main():
    await monitor_and_respond(
        tx_hash="<transaction_hash>",
        account_id="<account_id>",
        private_key="<private_key>",
        contract_id="<contract_id>",
        method="method_to_call",
        args={"param": "value"}
    )

asyncio.run(main())
