import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import * as borsh from 'borsh';
import * as fs from 'fs';
const seed: string = fs.readFileSync('/home/gitpod/.config/solana/id.json').toString();
const programId: PublicKey = new PublicKey(fs.readFileSync('./programid.txt').toString().trim());
const key: Uint8Array = Uint8Array.from(JSON.parse(seed.trim()));

/**
 * Establish a connection to the cluster
 */
async function establishConnection(): Promise<Connection> {
  const rpcUrl = 'http://localhost:8899';
  const connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);

  return connection;
}

class InstructionInfo {
  amount = 0;
  constructor(fields: {amount: number} | undefined = undefined) {
    if (fields) {
      this.amount = fields.amount;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
const InstructionInfoSchema = new Map([
  [InstructionInfo, {kind: 'struct', fields: [['amount', 'u32']]}],
]);

/**
 * The state of a greeting account managed by the hello world program
 */
 class StateAccount {
  counter = 0;
  balance = 0;
  constructor(fields: {counter: number, balance: number} | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
      this.balance = fields.balance;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
  [StateAccount, {kind: 'struct', fields: [['counter', 'u32'], ['balance', 'u32']]}],
]);

/**
 * The expected size of each greeting account.
 */
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new StateAccount(),
).length;

const getAccount = async (connection: Connection, signer: Keypair): Promise<PublicKey> => {
  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const programAccountSeed = 'hello22sss';
  const programAccountKey = await PublicKey.createWithSeed(
    signer.publicKey,
    programAccountSeed,
    programId,
  );
  // Check if the greeting account has already been created
  const programAccount = await connection.getAccountInfo(programAccountKey);

  if (programAccount === null) {
    console.log("Creating new program account", signer.publicKey);

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: signer.publicKey,
        basePubkey: signer.publicKey,
        seed: programAccountSeed,
        newAccountPubkey: programAccountKey,
        lamports: 400000000000000,
        space: GREETING_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [signer]);
  }
  return programAccountKey;
}

const main = async () => {
  const signer: Keypair = Keypair.fromSecretKey(key);
  const connection = await establishConnection();
  const balance = await connection.getBalance(signer.publicKey);
  const programAccount = await getAccount(connection, signer);

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: programAccount, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.from(borsh.serialize(InstructionInfoSchema, new InstructionInfo({
      amount: 100
    }))),
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [signer],
  );
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1)
  });