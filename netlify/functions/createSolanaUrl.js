// /netlify/functions/createSolanaUrl.js
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { createQR, encodeURL } from "@solana/pay";
import { NextResponse } from "@netlify/functions";

const recipient = new PublicKey("dev6vRg6EibnNDcrp6UGGgujvdnoVF6TexwruykPqo1");

export async function handler(event) {
  try {
    const { amount } = JSON.parse(event.body || "{}");

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const reference = new PublicKey(require("crypto").randomBytes(32).toString("hex").slice(0, 32));
    const url = encodeURL({
      recipient,
      amount,
      reference,
      label: "$FMEX Presale",
      message: "Thanks for your emotional investment!",
    });

    return NextResponse.json({ url: url.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
