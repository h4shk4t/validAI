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
    fn test_create_escrow() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let contract = Contract::new(accounts(0), accounts(2));

        // Create escrow
        let promise = contract.create_escrow(1, accounts(2), U128(1000));
        promise.simulate();

        // Check escrow
        let escrow = contract.get_escrow(1).unwrap();
        assert_eq!(escrow.item_id, 1);
        assert_eq!(escrow.price, U128(1000));
        assert_eq!(escrow.buyer, accounts(1));
        assert_eq!(escrow.seller, accounts(2));
        assert_eq!(escrow.status, EscrowStatus::Pending);
    }

    #[test]
    fn test_complete_escrow() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = Contract::new(accounts(0), accounts(2));
        contract.create_escrow(1, accounts(2), U128(1000)).simulate();

        // Complete escrow
        context.signer_account_id(accounts(1));
        contract.complete_escrow(1).simulate();

        let escrow = contract.get_escrow(1).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Completed);
    }

    #[test]
    fn test_refund_escrow() {
        let mut context = get_context(accounts(1));
        testing_env!(context.build());

        let mut contract = Contract::new(accounts(0), accounts(2));
        contract.create_escrow(1, accounts(2), U128(1000)).simulate();

        // Refund escrow
        context.signer_account_id(accounts(1));
        contract.refund_escrow(1).simulate();

        let escrow = contract.get_escrow(1).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Refunded);
    }
}