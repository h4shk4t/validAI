use crate::*;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{assert_one_yocto, Promise};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Item {
    pub id: u64,
    pub seller: AccountId,
    pub price: U128,
    pub is_listed: bool,
}

#[derive(BorshSerialize)]
pub enum StorageKey {
    Items,
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn list_item(&mut self, price: U128) {
        assert_one_yocto();
        assert!(price.0 > 0, "Price must be greater than zero");
        
        self.item_count += 1;
        let item = Item {
            id: self.item_count,
            seller: env::predecessor_account_id(),
            price,
            is_listed: true,
        };
        
        self.items.insert(&self.item_count, &item);
        
        env::log_str(&format!(
            "Item listed: {} by {} for {} yNEAR",
            self.item_count,
            env::predecessor_account_id(),
            price.0
        ));
    }

    #[payable]
    pub fn purchase_item(&mut self, item_id: u64) {
        let mut item = self.items.get(&item_id).expect("Item not found");
        assert!(item.is_listed, "Item not listed");
        
        ext_ft_contract::ext(self.valid_coin.clone())
            .with_attached_deposit(1)
            .ft_transfer_call(
                item.seller.clone(),
                item.price,
                None,
                "Item purchase".to_string(),
            );
            
        item.is_listed = false;
        self.items.insert(&item_id, &item);
        
        env::log_str(&format!(
            "Item {} purchased by {}",
            item_id,
            env::predecessor_account_id()
        ));
    }

    #[payable]
    pub fn withdraw(&mut self, amount: U128) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner_id,
            "Only owner can withdraw"
        );
        
        ext_ft_contract::ext(self.valid_coin.clone())
            .with_attached_deposit(1)
            .ft_transfer(
                env::predecessor_account_id(),
                amount,
                None,
            );
    }

    pub fn get_item(&self, item_id: u64) -> Option<Item> {
        self.items.get(&item_id)
    }

    pub fn get_items(&self, from_index: u64, limit: u64) -> Vec<(u64, Item)> {
        let keys = self.items.keys_as_vector();
        let values = self.items.values_as_vector();
        
        (from_index..std::cmp::min(from_index + limit, self.item_count))
            .map(|index| (keys.get(index).unwrap(), values.get(index).unwrap()))
            .collect()
    }

    pub fn get_item_count(&self) -> u64 {
        self.item_count
    }
}

#[ext_contract(ext_ft_contract)]
pub trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>) -> Promise;
    fn ft_transfer_call(
        &mut self,
        receiver_id: AccountId,
        amount: U128,
        memo: Option<String>,
        msg: String,
    ) -> Promise;
}