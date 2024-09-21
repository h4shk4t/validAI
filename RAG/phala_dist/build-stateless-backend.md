# Build Stateless Backend

## Why start with a stateless backend <a href="#why-start-with-a-stateless-backend" id="why-start-with-a-stateless-backend"></a>

Compared with traditional smart-contract-based DApps which store all their states on-chain and require transactions for interaction, the desired use cases of Phat Contract happen off-chain with no (or limited) data stored on-chain. For example, instead of implementing an [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) token with Phat Contract (whose balance has to be stored on-chain), we recommend deploying your ERC-20 contract on Ethereum and using Phat Contract to operate it.

Phat Contract itself focuses on computation instead of storage, so it can be very easy to build a stateless backend with Phat Contract. In fact, you can connect to other storage services with the HTTP requests using Phat Contract. Backends and especially serverless backends are usually stateless and work very well without databases.

Implementing a stateless backend also brings immediate benefits at no developing cost:

* **Easy concurrent processing.** With Phala, it’s easy to deploy your contract to multiple Workers, then all the instances can handle the users' off-chain requests (called [Query](call-your-contract.md)) concurrently if there are no state-consistency limitations;
* **Go purely off-chain.** If your contract is stateless, it goes totally off-chain and is no longer limited by gas fee and block latency anymore. Many Phat Contract advantages (like HTTP support) are only allowed off-chain.

## What if I really need states / transactions? <a href="#what-if-i-really-need-states--transactions" id="what-if-i-really-need-states--transactions"></a>

Phat Contract still supports the vanilla on-chain states and transaction processing!

What’s more, all the contract states are encrypted and stored. But when you use these states, Phat Contract will still become subject to gas fees and low performance just like smart contracts. We explain contract states in the [store-contract-states.md](store-contract-states.md "mention").

For off-chain computation, the recommended way to store your states is to use external storage services. Phat Contract can easily connect to S3-compatible storage services and use them as cheaper and faster off-chain state storage. Explore how to do this in the following section.

> Always remember your contract may be deployed to multiple Workers and they run concurrently. If multiple instances try to write to the storage services at the same time, there can be [race conditions](https://ketanbhatt.com/db-concurrency-defects/).
>
> For now, we do not provide native locking or transaction support for these storage services.
