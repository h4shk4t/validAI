#!/bin/bash
set -e

if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

if [ -z "$NEAR_ACCOUNT" ]; then
    echo "Error: NEAR_ACCOUNT environment variable is not set"
    exit 1
fi

echo "Deploying Token Contract..."
near deploy \
    --accountId $NEAR_ACCOUNT \
    --wasmFile artifacts/token.wasm \
    --initFunction new \
    --initArgs "{\"owner_id\": \"$NEAR_ACCOUNT\", \"total_supply\": \"1000000000000000000\", \"cap\": \"10000000000000000000\"}"

TOKEN_CONTRACT="$NEAR_ACCOUNT"

echo "Deploying Marketplace Contract..."
near deploy \
    --accountId marketplace.$NEAR_ACCOUNT \
    --wasmFile artifacts/marketplace.wasm \
    --initFunction new \
    --initArgs "{\"owner_id\": \"$NEAR_ACCOUNT\", \"valid_coin\": \"$TOKEN_CONTRACT\"}"

echo "Deploying Escrow Contract..."
near deploy \
    --accountId escrow.$NEAR_ACCOUNT \
    --wasmFile artifacts/escrow.wasm \
    --initFunction new \
    --initArgs "{\"owner_id\": \"$NEAR_ACCOUNT\", \"token\": \"$TOKEN_CONTRACT\"}"

echo "Deployment completed successfully!"