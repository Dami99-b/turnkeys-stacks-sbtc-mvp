import { useState } from 'react';
import Navbar from '../components/Navbar';
import WalletEmbed from '../components/WalletEmbed';
import TxLog from '../components/TxLog';
import { explorerForTx } from '../lib/stacksClient';

export default function Home() {
  const [acct, setAcct] = useState(null);
  const [to, setTo] = useState('');
  const [amt, setAmt] = useState('0.001');
  const [logs, setLogs] = useState([]);
  const [lastTx, setLastTx] = useState(null);

  function pushLog(m){ setLogs(l => [...l, `${new Date().toLocaleTimeString()} • ${m}`]); }

  async function onConnected(address, meta) {
    setAcct(address);
    pushLog(`Connected ${address} (${meta?.mock ? 'mock' : 'turnkey'})`);
  }

  // Client prepares a simple payload object — later replace with
  // `@stacks/transactions` makeUnsignedTransaction -> serialize for sign.
  function buildPayload() {
    return { from: acct, to, amount: amt, ts: Date.now() };
  }

  // Client signs payload (mock) OR calls Turnkey signer (TODO).
  async function signPayload(payload) {
    // If Turnkey available, call Turnkey sign here and return signedHex.
    // TODO: implement Turnkey client signing per docs:
    // e.g. const signed = await turnkey.signStacksTransaction(payloadToSign)
    // return signed.signedTxHex
    // For demo return fake signed hex:
    return '0x' + Math.random().toString(16).slice(2,40);
  }

  async function submit() {
    if (!acct) return pushLog('Connect wallet first');
    if (!to) return pushLog('Add recipient');
    const payload = buildPayload();
    pushLog('Building payload...');
    const signed = await signPayload(payload);
    pushLog('Signed payload (mock or turnkey) — sending to server to broadcast');
    // POST to serverless broadcast route
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedTxHex: signed })
      });
      const j = await res.json();
      if (j?.txid) {
        setLastTx(j.txid);
        pushLog('Broadcasted txid: ' + j.txid);
      } else {
        pushLog('Broadcast returned: ' + JSON.stringify(j));
      }
    } catch (err) {
      pushLog('Broadcast error: ' + err.message);
    }
  }

  return (
    <>
      <Navbar onConnect={()=>{}} connected={acct} />
      <main className="container">
        <div className="card">
          <h2>sBTC Payment (Stacks Testnet)</h2>
          <p className="muted">Connect an embedded wallet (Turnkey) or use the mock for demo.</p>

          <div style={{marginTop:12}}>
            <WalletEmbed onConnected={onConnected} />
          </div>

          <div style={{marginTop:14}}>
            <label>Recipient STX address</label>
            <input className="input" value={to} onChange={e=>setTo(e.target.value)} placeholder="ST..." />
            <label style={{marginTop:8}}>Amount (sBTC)</label>
            <input className="small-input" value={amt} onChange={e=>setAmt(e.target.value)} />
            <div style={{marginTop:12}}>
              <button className="btn" onClick={submit}>Send sBTC (demo)</button>
            </div>
          </div>
        </div>

        {lastTx && (
          <div style={{marginTop:12}} className="card">
            <div>Last tx: <a target="_blank" rel="noreferrer" href={explorerForTx(lastTx)}>{lastTx}</a></div>
          </div>
        )}

        <TxLog entries={logs} />
      </main>
    </>
  );
  }
