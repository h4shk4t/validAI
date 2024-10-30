#!/bin/bash
set -e

echo "Building contracts..."

cd contracts/marketplace
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
cd ../..

cd contracts/escrow
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
cd ../..

cd contracts/token
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
cd ../..

mkdir -p artifacts

cp target/wasm32-unknown-unknown/release/marketplace.wasm artifacts/
cp target/wasm32-unknown-unknown/release/escrow.wasm artifacts/
cp target/wasm32-unknown-unknown/release/token.wasm artifacts/

echo "Build completed successfully!"