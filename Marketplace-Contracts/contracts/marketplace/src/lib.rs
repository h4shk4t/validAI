use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::json_types::U128;
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise};

mod marketplace;
mod internal;
#[cfg(test)]
mod tests;

use crate::marketplace::{Item, StorageKey};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    pub owner_id: AccountId,
    pub valid_coin: AccountId,
    pub items: UnorderedMap<u64, Item>,
    pub item_count: u64,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId, valid_coin: AccountId) -> Self {
        Self {
            owner_id,
            valid_coin,
            items: UnorderedMap::new(StorageKey::Items),
            item_count: 0,
        }
    }
}