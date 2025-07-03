// netlify/functions/solanaPayURL.js
import { PublicKey } from "@solana/web3.js";

export async function handler(event, context) {
  try {
    const { amount } = JSON.parse(event.body);

    if (!amount || isNaN(amount) || amount < 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid amount" }),
      };
    }

    const recipient = new PublicKey("dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1");
    const label = "FMEX Presale";
    const message = "Revenge Coin Purchase";

    const baseUrl = `solana:${recipient.toString()}`;
    const params = new URLSearchParams({
      amount: amount.toString(),
      label,
      message,
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ url: fullUrl }),
    };
  } catch (error) {
    console.error("❌ URL generation error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate Solana Pay URL" }),
    };
  }
}
