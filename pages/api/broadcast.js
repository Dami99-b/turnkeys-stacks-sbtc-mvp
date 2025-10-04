// pages/api/broadcast.js
import fetch from 'cross-fetch';

const STX_NODE = process.env.STX_NODE_URL || 'https://stacks-node-api.testnet.stacks.co';

// In-memory store for demo: txid -> { txid, to, amount, from, ts, status }
// Note: serverless instances are ephemeral; this is only for demo UX during a single deployment.
const DEMO_TXS = global.__DEMO_TXS__ || (global.__DEMO_TXS__ = {});

function makeFakeTxId() {
  // 64 hex chars, prefixed like 0x...
  const rnd = () => Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
  return '0x' + (rnd()+rnd()+rnd()+rnd()+rnd()+rnd()+rnd()+rnd()).slice(0,64);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // optional: support /api/broadcast?txid=... to fetch mock status
    const { txid } = req.query;
    if (!txid) return res.status(400).json({ error: 'missing txid' });
    const t = DEMO_TXS[txid];
    if (!t) return res.status(404).json({ error: 'unknown txid' });
    return res.status(200).json({ ...t });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { signedTxHex, meta } = req.body || {};
    if (!signedTxHex) return res.status(400).json({ error: 'missing signedTxHex' });

    // Simulate server processing / broadcasting
    // Real implementation would POST binary to /v2/transactions and return txid.
    await new Promise(r => setTimeout(r, 850 + Math.random()*800)); // random delay 0.85 - 1.65s

    const txid = makeFakeTxId();
    const now = Date.now();
    // status progression: PENDING -> CONFIRMED after a small delay (we simulate)
    DEMO_TXS[txid] = {
      txid,
      status: 'PENDING',
      broadcastAt: now,
      // include any meta for client (from/to/amount)
      meta: meta || {},
    };

    // schedule confirmation (in-memory)
    setTimeout(() => {
      if (DEMO_TXS[txid]) DEMO_TXS[txid].status = 'CONFIRMED';
    }, 2500 + Math.random()*4000); // confirm after 2.5s - 6.5s

    // Return realistic response shape
    return res.status(200).json({
      txid,
      explorer: `https://explorer.testnet.stacks.co/txid/${txid}`,
      status: DEMO_TXS[txid].status,
      note: 'MOCK broadcast — simulated for demo'
    });

  } catch (err) {
    console.error('broadcast error', err);
    res.status(500).json({ error: err.message });
  }
}
