// pages/api/broadcast.js
import fetch from 'cross-fetch';

const STX_NODE = process.env.STX_NODE_URL || 'https://stacks-node-api.testnet.stacks.co';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { signedTxHex } = req.body || {};
    if (!signedTxHex) return res.status(400).json({ error: 'missing signedTxHex' });

    // Broadcast raw TX to Stacks node
    // POST /v2/transactions
    const r = await fetch(`${STX_NODE}/v2/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: Buffer.from(signedTxHex.replace(/^0x/,'') , 'hex')
    });
    const text = await r.text();
    if (!r.ok) {
      return res.status(500).json({ error: 'broadcast failed', details: text });
    }
    // On success Stacks returns txid in body
    const txid = text;
    return res.status(200).json({ txid });
  } catch (err) {
    console.error('broadcast error', err);
    res.status(500).json({ error: err.message });
  }
      }
