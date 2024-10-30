#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::testing_env;

    fn get_context(predecessor_account_id: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder
            .current_account_id(accounts(0))
            .signer_account_id(predecessor_account_id.clone())
            .predecessor_account_id(predecessor_account_id);
        builder
    }

    #[test]
    fn test_new() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        
        let metadata = FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: "Valid Coin".to_string(),
            symbol: "VALID".to_string(),
            icon: None,
            reference: None,
            reference_hash: None,
            decimals: 18,
        };
        
        let contract = Contract::new(
            accounts(1),
            U128(1_000_000_000_000_000),
            U128(10_000_000_000_000_000),
            metadata,
        );
        
        assert_eq!(contract.ft_total_supply().0, 1_000_000_000_000_000);
        assert_eq!(contract.ft_balance_of(accounts(1)).0, 1_000_000_000_000_000);
    }

    #[test]
    fn test_mint() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        
        let metadata = FungibleTokenMetadata {
            spec: FT_METADATA_SPEC.to_string(),
            name: "Valid Coin".to_string(),
            symbol: "VALID".to_string(),
            icon: None,
            reference: None,
            reference_hash: None,
            decimals: 18,
        };
        
        let mut contract = Contract::new(
            accounts(1),
            U128(1_000_000_000_000_000),
            U128(10_000_000_000_000_000),
            metadata,
        );
        
        contract.mint(accounts(2), U128(1_000_000));
        assert_eq!(contract.ft_balance_of(accounts(2)).0, 1_000_000);
        
        testing_env!(context
            .predecessor_account_id(accounts(1))
            .build());
            
        let result = std::panic::catch_unwind(move || {
            contract.mint(
                accounts(2),
                U128(10_000_000_000_000_000)
            );
        });
        assert!(result.is_err());
    }
}