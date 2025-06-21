const { Connection, PublicKey, Transaction, SystemProgram } = require("@solana/web3.js");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Only POST allowed",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const connection = new Connection(process.env.QUICKNODE_RPC, "confirmed");

    // Handle unsigned transaction creation
    if (body.action === "create") {
      const { from, to, amount } = body;

      const fromPubkey = new PublicKey(from);
      const toPubkey = new PublicKey(to);
      const latest = await connection.getLatestBlockhash("finalized");

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
      }).toString("base64");

      return {
        statusCode: 200,
        body: JSON.stringify({ transaction: serialized }),
      };
    }

    // Handle broadcast of signed tx
    if (body.action === "broadcast") {
      const { signedTx } = body;

      const buffer = Buffer.from(signedTx, "base64");
      const tx = Transaction.from(buffer);

      const signature = await connection.sendRawTransaction(tx);
      await connection.confirmTransaction(signature, "finalized");

      return {
        statusCode: 200,
        body: JSON.stringify({ signature }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid action" }),
    };
  } catch (err) {
    console.error("Solana proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
