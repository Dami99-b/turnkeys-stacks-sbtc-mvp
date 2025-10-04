import { useState } from "react";
import { showToast } from "./ToastRoot";

export default function SendCard({ account, onBroadcasted }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null); // null | signing | broadcasting | confirming

  async function handleSend() {
    if (!account) return showToast("Connect wallet first", "error");
    if (!to) return showToast("Add recipient", "error");
    setLoading(true);
    setStep('signing');

    try {
      // 1) Build payload (in production this would be a proper unsigned tx)
      const payload = { from: account, to, amount, ts: Date.now() };

      // 2) Signing step
      // In mock mode we simulate a signing animation and produce a fake signed hex.
      await wait(700); // "user signing" microdelay
      setStep('broadcasting');
      const fakeSignedHex = '0x' + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join('');

      // 3) Submit to broadcast API
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ signedTxHex: fakeSignedHex, meta: { from: account, to, amount } })
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error || 'broadcast failed');

      setStep('confirming');
      showToast('Broadcasted — awaiting confirmation', 'info');

      // 4) Poll for confirmation (simple exponential backoff)
      const txid = j.txid;
      const explorer = j.explorer;
      let confirmed = false;
      let attempts = 0;
      while (!confirmed && attempts < 12) {
        await wait(800 + attempts*300); // backoff
        attempts++;
        try {
          const chk = await fetch(`/api/broadcast?txid=${encodeURIComponent(txid)}`);
          if (!chk.ok) { /* ignore network glitches */ }
          else {
            const obj = await chk.json();
            if (obj.status === 'CONFIRMED') {
              confirmed = true;
              // save to local history
              const h = JSON.parse(localStorage.getItem('sbtc_history') || '[]');
              const txObj = { txid, explorer, from: account, to, amount, ts: Date.now(), status: 'CONFIRMED' };
              h.push(txObj);
              localStorage.setItem('sbtc_history', JSON.stringify(h));
              onBroadcasted && onBroadcasted(txid);
              showToast('Transaction confirmed ✅', 'success');
              break;
            }
          }
        } catch (e) {
          // ignore polling errors
        }
      }

      if (!confirmed) {
        showToast('Still pending — try explorer link', 'info');
        // still save as pending
        const h = JSON.parse(localStorage.getItem('sbtc_history') || '[]');
        h.push({ txid, explorer, from: account, to, amount, ts: Date.now(), status: 'PENDING' });
        localStorage.setItem('sbtc_history', JSON.stringify(h));
      }

      setTo(''); setAmount('0.001');

    } catch (err) {
      console.error(err);
      showToast('Send failed: ' + (err.message || 'unknown'), 'error');
    } finally {
      setStep(null);
      setLoading(false);
    }
  }

  function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

  return (
    <div className="card">
      <h3>Send sBTC</h3>

      <div style={{marginTop:8}}>
        <label className="muted">Recipient STX address</label>
        <input className="input" value={to} onChange={(e)=>setTo(e.target.value)} placeholder="ST..." />
      </div>

      <div style={{marginTop:8}}>
        <label className="muted">Amount (sBTC)</label>
        <input className="small-input" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      </div>

      <div style={{marginTop:12, textAlign:'right'}}>
        <button className="btn" onClick={handleSend} disabled={loading}>
          { step === 'signing' ? 'Signing…' : step === 'broadcasting' ? 'Broadcasting…' : step === 'confirming' ? 'Waiting confirmation…' : (loading ? 'Processing…' : 'Send') }
        </button>
      </div>

      <div style={{marginTop:10}} className="muted">
        Tip: demo-mode uses a secure mock flow. Replace with Turnkey signer for live signing.
      </div>
    </div>
  );
}
