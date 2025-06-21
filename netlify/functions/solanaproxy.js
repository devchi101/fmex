const {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} = require('@solana/web3.js');

const QUICKNODE_RPC = process.env.QUICKNODE_RPC; // Ensure this is set in Netlify env vars

const connection = new Connection(QUICKNODE_RPC, 'confirmed');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST allowed',
    };
  }

  try {
    const { from, to, amount, signedTx } = JSON.parse(event.body);

    if (signedTx) {
      // Broadcast path
      const bufferTx = Buffer.from(signedTx, 'base64');
      const transaction = Transaction.from(bufferTx);

      const signature = await connection.sendRawTransaction(transaction.serialize());
      await connection.confirmTransaction(signature, 'finalized');

      return {
        statusCode: 200,
        body: JSON.stringify({ signature }),
      };
    } else {
      // Prepare transaction path
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
          lamports: Math.round(amount * 1e9),
        })
      );

      const serialized = transaction.serialize({
        requireAllSignatures: false,
      }).toString('base64');

      return {
        statusCode: 200,
        body: JSON.stringify({ transaction: serialized }),
      };
    }
  } catch (err) {
    console.error("❌ Solana proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
