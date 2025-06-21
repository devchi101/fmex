const { Connection, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

exports.handler = async function (event) {
  try {
    const { from, to, amount } = JSON.parse(event.body);

    const connection = new Connection(process.env.QUICKNODE_RPC, 'confirmed');
    const fromPubkey = new PublicKey(from);
    const toPubkey = new PublicKey(to);

    const latest = await connection.getLatestBlockhash();

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

    const serialized = transaction.serialize({
      requireAllSignatures: false,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        transaction: Buffer.from(serialized).toString('base64'),
      }),
    };
  } catch (err) {
    console.error("Create tx error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
