// /netlify/functions/checkPayment.js
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { findReference, validateTransfer } from "@solana/pay";

const recipient = new PublicKey("dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1");
const connection = new Connection(clusterApiUrl("mainnet-beta"));

export async function handler(event) {
  try {
    const { reference, amount } = JSON.parse(event.body || "{}");
    if (!reference || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing reference or amount" }),
      };
    }

    const refPublicKey = new PublicKey(reference);

    // Wait for transaction with matching reference
    const signatureInfo = await findReference(connection, refPublicKey, { finality: "confirmed" });

    // Validate the transaction details
    await validateTransfer(connection, signatureInfo.signature, {
      recipient,
      amount,
      reference: refPublicKey,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ confirmed: true, signature: signatureInfo.signature }),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: JSON.stringify({ confirmed: false, error: err.message }),
    };
  }
}
