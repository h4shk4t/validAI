use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near, AccountId, Balance, Promise, PanicOnDefault};
use near_sdk::collections::{LookupMap};

// Define a struct for an item listed in the marketplace.
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Item {
    id: u64,
    seller: AccountId,
    price: Balance,
    is_listed: bool,
}

// Define a struct for escrow.
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Escrow {
    item_id: u64,
    price: Balance,
    buyer: AccountId,
    seller: AccountId,
    is_completed: bool,
    created_at: u64,
}

// Define the contract structure.
#[near(contract_state)]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Marketplace {
    items: LookupMap<u64, Item>,    // Items stored in a map
    escrows: LookupMap<u64, Escrow>, // Escrow details
    downloads: LookupMap<u64, u64>,  // Track downloads for each item
    item_count: u64,                // Counter for the total number of items
    valid_coin: AccountId,          // Token contract
    cap: Balance,                   // Cap for the mintable token
    owner: AccountId,               // Contract owner
}

// Implement the contract logic.
#[near]
impl Marketplace {
    // Initialize the contract with a token contract and owner.
    #[init]
    pub fn new(valid_coin: AccountId, cap: Balance) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            items: LookupMap::new(b"i".to_vec()),
            escrows: LookupMap::new(b"e".to_vec()),
            downloads: LookupMap::new(b"d".to_vec()),
            item_count: 0,
            valid_coin,
            cap,
            owner: env::signer_account_id(),
        }
    }

    // List a new item for sale.
    pub fn list_item(&mut self, price: Balance) {
        assert!(price > 0, "Price must be greater than zero");
        self.item_count += 1;
        let item = Item {
            id: self.item_count,
            seller: env::signer_account_id(),
            price,
            is_listed: true,
        };
        self.items.insert(&self.item_count, &item);
        env::log_str(&format!("Item listed: id {}, seller {}, price {}", self.item_count, item.seller, item.price));
    }

    // Create an escrow when purchasing an item.
    pub fn create_escrow(&mut self, item_id: u64) {
        let item = self.items.get(&item_id).expect("Item not listed");
        assert!(item.is_listed, "Item not listed for sale");

        let buyer = env::signer_account_id();
        let deposit = env::attached_deposit();
        assert!(deposit >= item.price, "Insufficient funds sent for purchase");

        let escrow = Escrow {
            item_id,
            price: item.price,
            buyer: buyer.clone(),
            seller: item.seller.clone(),
            is_completed: false,
            created_at: env::block_timestamp(),
        };

        self.escrows.insert(&item_id, &escrow);
        env::log_str(&format!("Escrow created: item_id {}, buyer {}, seller {}, price {}", item_id, buyer, item.seller, item.price));
    }

    // Release payment after 7 days or after 1000 downloads.
    pub fn release_payment(&mut self, item_id: u64) {
        let mut escrow = self.escrows.get(&item_id).expect("Escrow not found");
        assert!(!escrow.is_completed, "Payment already completed");

        let current_time = env::block_timestamp();
        let download_count = self.downloads.get(&item_id).unwrap_or(0);

        if current_time >= escrow.created_at + 7 * 24 * 60 * 60 * 1_000_000_000 || download_count >= 1000 {
            // Transfer the funds to the seller
            Promise::new(escrow.seller.clone()).transfer(escrow.price);
            escrow.is_completed = true;
            self.escrows.insert(&item_id, &escrow);

            env::log_str(&format!("Payment released for item_id {} to seller {}", item_id, escrow.seller));
        }
    }

    // Increment download count, releasing funds if it reaches 1000.
    pub fn increment_downloads(&mut self, item_id: u64) {
        let mut download_count = self.downloads.get(&item_id).unwrap_or(0);
        download_count += 1;
        self.downloads.insert(&item_id, &download_count);

        if download_count >= 1000 {
            self.release_payment(item_id);
        }
    }

    // Mint new tokens up to the cap.
    pub fn mint_tokens(&mut self, to: AccountId, amount: Balance) {
        assert_eq!(env::signer_account_id(), self.owner, "Only the owner can mint");
        let current_supply: Balance = self.get_total_supply();
        assert!(current_supply + amount <= self.cap, "Cap exceeded");

        // Simulate minting by transferring funds to the given account
        Promise::new(to.clone()).transfer(amount);
        env::log_str(&format!("Minted {} tokens to {}", amount, to));
    }

    // Get the total supply (dummy function to simulate total supply).
    pub fn get_total_supply(&self) -> Balance {
        // In a real implementation, this would track actual token supply.
        1_000_000_000_000 // Dummy value
    }

    // Withdraw contract's tokens by the owner.
    pub fn withdraw(&mut self, amount: Balance) {
        assert_eq!(env::signer_account_id(), self.owner, "Only the owner can withdraw");
        Promise::new(self.owner.clone()).transfer(amount);
    }
}
