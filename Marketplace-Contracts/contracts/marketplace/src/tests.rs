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
            .predecessor_account_id(predecessor_account_id)
            .attached_deposit(1);
        builder
    }

    #[test]
    fn test_new() {
        let context = get_context(accounts(1));
        testing_env!(context.build());
        
        let contract = Contract::new(accounts(1), accounts(2));
        
        assert_eq!(contract.owner_id, accounts(1));
        assert_eq!(contract.valid_coin, accounts(2));
        assert_eq!(contract.item_count, 0);
    }

    #[test]
    fn test_list_item() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        
        let mut contract = Contract::new(accounts(1), accounts(2));
        
        contract.list_item(U128(1000));
        
        let item = contract.get_item(1).unwrap();
        assert_eq!(item.price.0, 1000);
        assert_eq!(item.seller, accounts(1));
        assert!(item.is_listed);
    }

    #[test]
    #[should_panic(expected = "Price must be greater than zero")]
    fn test_list_item_zero_price() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        
        let mut contract = Contract::new(accounts(1), accounts(2));
        contract.list_item(U128(0));
    }

    #[test]
    fn test_get_items() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        
        let mut contract = Contract::new(accounts(1), accounts(2));
        
        contract.list_item(U128(1000));
        contract.list_item(U128(2000));
        contract.list_item(U128(3000));
        
        let items = contract.get_items(0, 10);
        assert_eq!(items.len(), 3);
        
        let (id, item) = &items[0];
        assert_eq!(*id, 1);
        assert_eq!(item.price.0, 1000);
        
        let (id, item) = &items[2];
        assert_eq!(*id, 3);
        assert_eq!(item.price.0, 3000);
    }

    #[test]
    fn test_pagination() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());
        
        let mut contract = Contract::new(accounts(1), accounts(2));
        
        for i in 1..=5 {
            contract.list_item(U128(i * 1000));
        }
        
        let items = contract.get_items(1, 2);
        assert_eq!(items.len(), 2);
        
        let (id, item) = &items[0];
        assert_eq!(*id, 2);
        assert_eq!(item.price.0, 2000);
        
        let (id, item) = &items[1];
        assert_eq!(*id, 3);
        assert_eq!(item.price.0, 3000);
    }
}