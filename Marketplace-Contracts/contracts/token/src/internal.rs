use crate::*;

impl Contract {
    pub(crate) fn internal_unwrap_balance_of(&self, account_id: &AccountId) -> Balance {
        self.token.accounts.get(account_id).unwrap_or(0)
    }

    pub(crate) fn internal_deposit(&mut self, account_id: &AccountId, amount: Balance) {
        let balance = self.internal_unwrap_balance_of(account_id);
        if let Some(new_balance) = balance.checked_add(amount) {
            self.token.accounts.insert(account_id, &new_balance);
            self.token.total_supply = self
                .token
                .total_supply
                .checked_add(amount)
                .unwrap_or_else(|| env::panic_str("Total supply overflow"));
        } else {
            env::panic_str("Balance overflow");
        }
    }

    pub(crate) fn internal_withdraw(&mut self, account_id: &AccountId, amount: Balance) {
        let balance = self.internal_unwrap_balance_of(account_id);
        if let Some(new_balance) = balance.checked_sub(amount) {
            self.token.accounts.insert(account_id, &new_balance);
            self.token.total_supply = self
                .token
                .total_supply
                .checked_sub(amount)
                .unwrap_or_else(|| env::panic_str("Total supply overflow"));
        } else {
            env::panic_str("The account doesn't have enough balance");
        }
    }
}