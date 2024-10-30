#!/bin/bash
set -e

if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

if [ -z "$NEAR_ACCOUNT" ]; then
    echo "Error: NEAR_ACCOUNT environment variable is not set"
    exit 1
fi

echo "Running unit tests..."
cd contracts/marketplace
cargo test
cd ../escrow
cargo test
cd ../token
cargo test
cd ../..

echo "Running integration tests..."
cd integration-tests
cargo test
cd ..

echo "Deployment and integration tests completed successfully!"