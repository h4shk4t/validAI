use near_sdk::{near, env, AccountId, Promise, CryptoHash, NearToken, PanicOnDefault, Gas, GasWeight, PromiseError};
use near_sdk_contract_tools::{event, standard::nep297::Event};
// use near_sdk::serde::{Deserialize, Serialize};
use std::collections::HashMap;
use serde_json::json;

const YIELD_REGISTER: u64 = 0;

// Structure to hold information about model and reward balance
#[derive(Clone)]
#[derive(serde::Serialize)]
pub struct ModelInfo {
    model_name: String,
    reward: NearToken,
}

#[near(serializers = [json])]
pub enum Response {
    Answer(String),
    TimeOutError,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct AvsLogic {
    attestation_center: AccountId,
    request_id: u64,
    models: HashMap<String, AccountId>, // Map performer address to model and reward
}

#[event(version = "1.0.0", standard = "nep297")]
pub struct AvsEvent {
    pub model_name: String,
    pub prompt: String,
    pub yield_id: CryptoHash
}


#[near]
impl AvsLogic {
    #[init]
    pub fn new(attestation_center: AccountId) -> Self {
        Self {
            request_id: 0,
            attestation_center,
            models: HashMap::new()
        }
    }

    pub fn before_task_submission(
        &mut self,
        _task_definition_id: u16,
        _performer_addr: AccountId,
        _proof_of_task: String,
        _is_approved: bool,
        _tp_signature: Vec<u8>,
        _ta_signature: [u128; 2],
        _operator_ids: Vec<u128>,
    ) {
        self.request_id += 1;
        // this will create a unique ID in the YIELD_REGISTER
        let yield_promise = env::promise_yield_create(
            "return_external_response",
            &json!({ "request_id": self.request_id })
                .to_string()
                .into_bytes(),
            Gas::from_tgas(5),
            GasWeight::default(),
            YIELD_REGISTER,
        );

        // load the ID created by the promise_yield_create
        let yield_id: CryptoHash = env::read_register(YIELD_REGISTER)
            .expect("read_register failed")
            .try_into()
            .expect("conversion to CryptoHash failed");
        // // store the request, so we can delete it later
        // let request = ModelInfo { yield_id, prompt };
        // self.requests.insert(self.request_id, request);

        // Emit an event with the yield_id and the prompt
        let event = AvsEvent {
            model_name: "model_name".to_string(),
            prompt: "prompt".to_string(),
            yield_id
        };
        event.emit();
        
        // return the yield promise
        env::promise_return(yield_promise);
    }

    pub fn respond(&mut self, yield_id: CryptoHash, response: String) {
        // resume computation with the response
        env::promise_yield_resume(&yield_id, &serde_json::to_vec(&response).unwrap());
    }

    #[private]
    pub fn return_external_response(
        &mut self,
        request_id: u32,
        #[callback_result] response: Result<String, PromiseError>,
    ) -> Response {
        // self.requests.remove(&request_id);

        match response {
            Ok(answer) => Response::Answer(answer),
            Err(_) => Response::TimeOutError,
        }
    }

    // Register a model with its associated reward for a performer
    pub fn register_model(&mut self, model_addr: AccountId, model_name: String, reward: NearToken) {
        // let model_info = ModelInfo { model_name, reward };
        self.models.insert(model_name.clone(), model_addr);
        env::log_str(&format!("Model registered for {} with reward {}", model_name, reward));
    }

    // Perform inference after task submission and reward the performer
    pub fn after_task_submission(
        &mut self,
        _task_definition_id: u16,
        model_info: ModelInfo,
        _proof_of_task: String,
        _is_approved: bool,
        _tp_signature: Vec<u8>,
        _ta_signature: [u128; 2],
        _operator_ids: Vec<u128>,
    ) {
        // Check if the performer is registered with a model
        if let Some(model_account) = self.models.get(&model_info.model_name) {
            // Simulate the inference process (just log it)
            env::log_str(&format!(
                "Running inference on model: {} by {}",
                model_info.model_name, model_account
            ));
            
            // Reward the performer (log the reward for now)
            env::log_str(&format!(
                "Rewarding performer: {} with {} NEAR for using model: {}",
                model_account, model_info.reward, model_info.model_name
            ));
            Promise::new(model_account.clone()).transfer(model_info.reward);
        } else {
            env::log_str(&format!("No model registered for for {}", model_info.model_name));
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;
//     use near_sdk::test_utils::{VMContextBuilder};
//     use near_sdk::{testing_env, AccountId, PromiseResult};

//     // Helper function to create a testing environment
//     fn get_context(signer_account_id: AccountId) -> VMContextBuilder {
//         let mut builder = VMContextBuilder::new();
//         builder.signer_account_id(signer_account_id);
//         builder
//     }

//     #[test]
//     fn test_new() {
//         let account_id = AccountId::new_unchecked("attestation_center.testnet".to_string());
//         let context = get_context(account_id.clone());
//         testing_env!(context.build());

//         let contract = AvsLogic::new(account_id.clone());
//         assert_eq!(contract.attestation_center, account_id);
//         assert_eq!(contract.request_id, 0);
//         assert_eq!(contract.models.len(), 0);
//     }

//     #[test]
//     fn test_register_model() {
//         let account_id = AccountId::new_unchecked("attestation_center.testnet".to_string());
//         let context = get_context(account_id.clone());
//         testing_env!(context.build());

//         let mut contract = AvsLogic::new(account_id.clone());
//         let model_addr = AccountId::new_unchecked("model_owner.testnet".to_string());

//         // Register a model
//         contract.register_model(model_addr.clone(), "my_model".to_string(), NearToken::from(10));

//         // Assert the model is registered
//         assert_eq!(contract.models.get("my_model").unwrap(), &model_addr);
//     }

//     #[test]
//     fn test_before_task_submission() {
//         let account_id = AccountId::new_unchecked("attestation_center.testnet".to_string());
//         let context = get_context(account_id.clone());
//         testing_env!(context.build());

//         let mut contract = AvsLogic::new(account_id.clone());
//         contract.before_task_submission(1, account_id.clone(), "proof".to_string(), true, vec![], [0, 0], vec![]);
        
//         // Ensure request_id increments
//         assert_eq!(contract.request_id, 1);

//         // Test event emission by checking logs (requires test_env logging features)
//         // assert!(logs().contains("Running inference on model"));
//     }

//     #[test]
//     fn test_after_task_submission_with_registered_model() {
//         let account_id = AccountId::new_unchecked("attestation_center.testnet".to_string());
//         let model_account = AccountId::new_unchecked("model_owner.testnet".to_string());
//         let context = get_context(account_id.clone());
//         testing_env!(context.build());

//         let mut contract = AvsLogic::new(account_id.clone());
//         contract.register_model(model_account.clone(), "my_model".to_string(), NearToken::from(10));

//         let model_info = ModelInfo {
//             model_name: "my_model".to_string(),
//             reward: NearToken::from(10),
//         };

//         contract.after_task_submission(1, model_info.clone(), "proof".to_string(), true, vec![], [0, 0], vec![]);
        
//         // Check if the logs contain the correct reward transfer (if using logs)
//         // assert!(logs().contains("Rewarding performer"));
//     }
// }
