use crate::*;

impl Contract {
    pub(crate) fn assert_owner(&self) {
        assert_eq!(
            env::predecessor_account_id(),
            self.owner_id,
            "Only contract owner can call this method"
        );
    }

    pub(crate) fn assert_valid_caller(&self, caller_id: AccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            caller_id,
            "Caller is not authorized"
        );
    }

    pub(crate) fn internal_add_item(
        &mut self,
        seller: AccountId,
        price: U128,
    ) -> u64 {
        self.item_count += 1;
        let item = Item {
            id: self.item_count,
            seller,
            price,
            is_listed: true,
        };
        
        self.items.insert(&self.item_count, &item);
        self.item_count
    }

    pub(crate) fn internal_remove_item(&mut self, item_id: u64) {
        self.items.remove(&item_id);
    }

    pub(crate) fn internal_transfer_tokens(
        &self,
        token_id: AccountId,
        from: AccountId,
        to: AccountId,
        amount: U128,
        memo: Option<String>,
    ) -> Promise {
        ext_ft_contract::ext(token_id)
            .with_attached_deposit(1)
            .ft_transfer(to, amount, memo)
    }
}