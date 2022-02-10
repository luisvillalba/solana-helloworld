use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info}, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey, program_error::ProgramError
};

entrypoint!(process_instruction);

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct StateAccount {
    /// number of greetings
    pub counter: u32,
    pub balance: u32,
}

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct InputData {
    pub amount: u32,
}

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello World Rust program entrypoint");
    let data: InputData = InputData::try_from_slice(&instruction_data)?;
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    msg!("Adding: {}", data.amount);

    msg!("account.owner: {}", account.owner);
    msg!("account.key: {}", account.key);

    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // // Increment and store the number of times the account has been greeted
    let mut greeting_account: StateAccount = StateAccount::try_from_slice(&account.data.borrow())?;
    greeting_account.counter += 1;
    greeting_account.balance += data.amount;
    greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Now the counter is: {}", greeting_account.counter);
    msg!("Now the balance is is: {}", greeting_account.balance);

    Ok(())
}