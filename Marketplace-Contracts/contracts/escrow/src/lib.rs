use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::{U128, U64};
use near_sdk::{
    env, near_bindgen, AccountId, Balance, BorshStorageKey, PanicOnDefault, Promise,
};

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
#[near_bindgen]
pub struct Contract {
    pub owner_id: AccountId,
    pub token_contract: AccountId,
    pub escrows: UnorderedMap<u64, Escrow>,
    pub escrow_count: u64,
}

#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
pub struct Escrow {
    pub item_id: u64,
    pub price: U128,
    pub buyer: AccountId,
    pub seller: AccountId,
    pub status: EscrowStatus,
    pub created_at: u64,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq)]
pub enum EscrowStatus {
    Pending,
    Completed,
    Refunded,
}

#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKey {
    Escrows,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId, token_contract: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id,
            token_contract,
            escrows: UnorderedMap::new(StorageKey::Escrows),
            escrow_count: 0,
        }
    }

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

    pub fn get_escrow(&self, escrow_id: u64) -> Option<Escrow> {
        self.escrows.get(&escrow_id)
    }

    pub fn get_escrows(
        &self,
        from_index: Option<u64>,
        limit: Option<u64>,
    ) -> Vec<(u64, Escrow)> {
        let keys = self.escrows.keys_as_vector();
        let values = self.escrows.values_as_vector();

        let from_index = from_index.unwrap_or(0);
        let limit = limit.unwrap_or(keys.len());

        (from_index..std::cmp::min(from_index + limit, keys.len()))
            .map(|index| (keys.get(index).unwrap(), values.get(index).unwrap()))
            .collect()
    }
}

#[ext_contract(ext_fungible_token)]
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