// netlify/functions/solanaPayURL.js
import { PublicKey } from "@solana/web3.js";

export default async (req, res) => {
  try {
    const { amount } = JSON.parse(req.body);

    if (!amount || isNaN(amount) || amount < 1) {
      return res.status(400).json({ error: "Invalid amount" });
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

    console.log("Generated Solana Pay URL:", fullUrl); // ✅ LOG HERE

    return res.status(200).json({ url: fullUrl });
  } catch (error) {
    console.error("URL generation error:", error); // ✅ Catch & log error
    return res.status(500).json({ error: "Failed to generate URL" });
  }
};
