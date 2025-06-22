const { Connection } = require('@solana/web3.js');
const bs58 = require('bs58');

exports.handler = async function (event) {
  try {
    const { signedTxBase64 } = JSON.parse(event.body);
    const connection = new Connection(process.env.QUICKNODE_RPC, 'confirmed');

    const rawTx = Buffer.from(signedTxBase64, 'base64');
    const signature = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(signature, 'finalized');

  } catch (err) {
    console.error("Broadcast error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
return {
  statusCode: 200,
  body: JSON.stringify({
    success: true,
    signature, // ✅ Include this
  }),
};
