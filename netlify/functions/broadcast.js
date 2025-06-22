const { Connection } = require("@solana/web3.js");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Only POST allowed",
    };
  }

  try {
    const { rawTx } = JSON.parse(event.body);
    if (!rawTx) throw new Error("Missing raw transaction");

    const connection = new Connection(process.env.QUICKNODE_RPC, "confirmed");

    const txBuffer = Buffer.from(rawTx); // rawTx is expected as array of bytes
    const signature = await connection.sendRawTransaction(txBuffer);
    await connection.confirmTransaction(signature, "finalized");

    return {
      statusCode: 200,
      body: JSON.stringify({ signature }),
    };
  } catch (err) {
    console.error("Broadcast error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
