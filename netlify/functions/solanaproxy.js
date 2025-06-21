const {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} = require('@solana/web3.js');
require('dotenv').config();

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST allowed',
    };
  }

  try {
    const body = JSON.parse(event.body);
    const connection = new Connection(process.env.QUICKNODE_RPC, 'confirmed');

    // Step 1: Broadcast signed tx if provided
    if (body.signedTx) {
      const txBuffer = Buffer.from(body.signedTx, 'base64');
      const txSignature = await connection.sendRawTransaction(txBuffer);
      await connection.confirmTransaction(txSignature, 'finalized');

      return {
        statusCode: 200,
        body: JSON.stringify({ signature: txSignature }),
      };
    }

    // Step 2: Prepare unsigned tx
    const { from, to, amount } = body;
    const fromPubkey = new PublicKey(from);
    const toPubkey = new PublicKey(to);

    const latest = await connection.getLatestBlockhash('finalized');

    const transaction = new Transaction({
      recentBlockhash: latest.blockhash,
      feePayer: fromPubkey,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * 1e9,
      })
    );

    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
    }).toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ transaction: serializedTx }),
    };

  } catch (err) {
    console.error("Solana proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
