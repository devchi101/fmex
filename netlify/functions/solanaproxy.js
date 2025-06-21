const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST allowed',
    };
  }

  try {
    const { from, to, amount } = JSON.parse(event.body);
    const connection = new Connection(process.env.QUICKNODE_RPC, 'confirmed');

    const fromPubkey = new PublicKey(from);
    const toPubkey = new PublicKey(to);
    const latest = await connection.getLatestBlockhash('finalized');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * 1e9,
      })
    );

    transaction.recentBlockhash = latest.blockhash;
    transaction.feePayer = fromPubkey;

    const serialized = transaction.serialize({
      requireAllSignatures: false,
    }).toString('base64');

    return {
      statusCode: 200,
      body: JSON.stringify({ transaction: serialized }),
    };
  } catch (err) {
    console.error("Solana proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};