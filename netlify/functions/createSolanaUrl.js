// /netlify/functions/createSolanaUrl.js
import { PublicKey } from "@solana/web3.js";
import { encodeURL } from "@solana/pay";

// Replace with your actual wallet
const recipient = new PublicKey("dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1");

export async function handler(event) {
  try {
    const { amount } = JSON.parse(event.body || "{}");

    if (!amount || isNaN(amount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    // Create a 32-byte random public key reference
    const reference = new PublicKey(
      Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex")
    );

    const url = encodeURL({
      recipient,
      amount,
      reference,
      label: "$FMEX Presale",
      message: "Thanks for your emotional investment!",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: url.toString() }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
