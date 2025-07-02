// netlify/functions/solanaPayURL.js
import { PublicKey } from "@solana/web3.js";

export default async (req, res) => {
  const { amount } = JSON.parse(req.body);
  if (!amount || isNaN(amount) || amount < 1) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const recipient = new PublicKey("dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1");
  const label = "FMEX Presale";
  const message = "Revenge Coin Purchase";

  const url = new URL("solana:" + recipient.toString());
  url.searchParams.set("amount", amount.toString());
  url.searchParams.set("label", label);
  url.searchParams.set("message", message);

  return res.status(200).json({ url: url.toString() });
};
