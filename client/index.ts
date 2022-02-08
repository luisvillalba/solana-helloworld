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

const programId = new PublicKey('');
const key: Uint8Array = Uint8Array.from([])

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

const main = async () => {
  const signer: Keypair = Keypair.fromSecretKey(key);
  const connection = await establishConnection();
  const balance = await connection.getBalance(signer.publicKey);

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: signer.publicKey, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0),
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