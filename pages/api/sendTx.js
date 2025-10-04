import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  StacksTestnet,
  standardPrincipalCV,
  uintCV,
  privateKeyToString,
  bufferCVFromString,
} from "@stacks/transactions";
import { bufferCV } from "@stacks/transactions";
import fetch from "cross-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, amount } = req.body;
    if (!to || !amount)
      return res.status(400).json({ error: "Missing to or amount" });

    const key = process.env.SERVER_STX_PRIVATE_KEY;
    if (!key) return res.status(500).json({ error: "Missing SERVER_STX_PRIVATE_KEY" });

    const network = new StacksTestnet();

    const tx = await makeSTXTokenTransfer({
      recipient: to,
      amount: BigInt(Number(amount) * 1_000_000), // microSTX
      senderKey: key,
      network,
      memo: "sBTC Demo Transfer",
    });

    const result = await broadcastTransaction(tx, network);
    if (result.error) {
      console.error(result);
      return res.status(500).json({ error: result.reason });
    }

    return res.status(200).json({
      txid: result.txid,
      explorer: `https://explorer.testnet.stacks.co/txid/${result.txid}`,
      status: "BROADCASTED",
    });
  } catch (e) {
    console.error("sendTx failed", e);
    return res.status(500).json({ error: e.message });
  }
}
