const { Connection } = require('@solana/web3.js');
const bs58 = require('bs58');

exports.handler = async function (event) {
  try {
    const { signedTxBase64 } = JSON.parse(event.body);
    const connection = new Connection(process.env.QUICKNODE_RPC, 'confirmed');

    const rawTx = Buffer.from(signedTxBase64, 'base64');
    const txId = await connection.sendRawTransaction(rawTx);
    await connection.confirmTransaction(txId, 'finalized');

    return {
      statusCode: 200,
      body: JSON.stringify({ signature: txId }),
    };
  } catch (err) {
    console.error("Broadcast error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
