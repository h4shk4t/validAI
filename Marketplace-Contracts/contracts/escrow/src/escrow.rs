// contracts/escrow/src/escrow.rs
use crate::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn create_escrow(
        &mut self,
        item_id: u64,
        seller: AccountId,
        price: U128,
    ) -> Promise {
        assert_eq!(
            env::predecessor_account_id(),
            env::signer_account_id(),
            "Only buyer can create escrow"
        );
        assert_eq!(
            self.escrows.get(&item_id).unwrap_or_default().status,
            EscrowStatus::Pending,
            "Escrow already exists"
        );

        self.escrow_count += 1;
        let escrow = Escrow {
            item_id,
            price,
            buyer: env::predecessor_account_id(),
            seller,
            status: EscrowStatus::Pending,
            created_at: env::block_timestamp(),
        };
        self.escrows.insert(&self.escrow_count, &escrow);

        ext_fungible_token::ext(self.token_contract.clone())
            .with_attached_deposit(1)
            .ft_transfer_call(
                env::current_account_id(),
                price,
                None,
                format!("Creating escrow for item {}", item_id),
            )
    }

    #[payable]
    pub fn complete_escrow(&mut self, escrow_id: u64) {
        assert_eq!(
            env::predecessor_account_id(),
            self.escrows.get(&escrow_id).unwrap().buyer,
            "Only buyer can complete escrow"
        );
        let mut escrow = self.escrows.get(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");

        escrow.status = EscrowStatus::Completed;
        self.escrows.insert(&escrow_id, &escrow);

        ext_fungible_token::ext(self.token_contract.clone())
            .with_attached_deposit(1)
            .ft_transfer(escrow.seller, escrow.price, None);
    }

    #[payable]
    pub fn refund_escrow(&mut self, escrow_id: u64) {
        assert_eq!(
            env::predecessor_account_id(),
            self.escrows.get(&escrow_id).unwrap().buyer,
            "Only buyer can refund escrow"
        );
        let mut escrow = self.escrows.get(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");

        escrow.status = EscrowStatus::Refunded;
        self.escrows.insert(&escrow_id, &escrow);

        ext_fungible_token::ext(self.token_contract.clone())
            .with_attached_deposit(1)
            .ft_transfer(escrow.buyer, escrow.price, None);
    }

    #[private]
    pub fn weekly_payout(&mut self, escrow_id: u64) {
        let mut escrow = self.escrows.get(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");
        assert!(
            env::block_timestamp() >= escrow.created_at + 7 * 24 * 60 * 60 * 10u64.pow(9),
            "Not yet eligible for weekly payout"
        );

        escrow.status = EscrowStatus::Completed;
        self.escrows.insert(&escrow_id, &escrow);

        ext_fungible_token::ext(self.token_contract.clone())
            .with_attached_deposit(1)
            .ft_transfer(escrow.seller, escrow.price, None);
    }

    #[payable]
    pub fn request_payout(&mut self, escrow_id: u64) {
        assert_eq!(
            env::predecessor_account_id(),
            self.escrows.get(&escrow_id).unwrap().seller,
            "Only seller can request payout"
        );
        let mut escrow = self.escrows.get(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Pending, "Escrow not pending");

        escrow.status = EscrowStatus::Completed;
        self.escrows.insert(&escrow_id, &escrow);

        ext_fungible_token::ext(self.token_contract.clone())
            .with_attached_deposit(1)
            .ft_transfer(escrow.seller, escrow.price, None);
    }
}