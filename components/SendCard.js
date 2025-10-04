import { useState } from "react";
import { showToast } from "./ToastRoot"; // if you use ToastRoot; otherwise swap with alert

export default function SendCard({ wallet, onBroadcasted }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(null);

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function handleSend(e) {
    e?.preventDefault();
    if (!wallet) return showToast ? showToast("Connect wallet first", "error") : alert("Connect wallet first");
    if (!to) { showToast ? showToast("Add recipient", "error") : alert("Add recipient"); return; }
    setLoading(true); setStep("signing");

    try {
      // demo signing animation
      await wait(700);
      setStep("broadcasting");

      // fake signed hex
      const fakeSignedHex = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");

      // call broadcast API (mock or real depending on your /api/broadcast)
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ signedTxHex: fakeSignedHex, meta: { from: wallet?.address || "demo", to, amount } })
      });
      const j = await res.json();
      if (j?.error) throw new Error(j.error || "broadcast failed");
      setStep("confirming");

      // poll for confirmation (server sim)
      const txid = j.txid || j.txId || j.tx;
      onBroadcasted && onBroadcasted(txid);
      showToast ? showToast("Broadcasted: " + txid, "info") : null;

      // poll status quickly (server mock will change status)
      let confirmed = false;
      for (let i=0;i<10;i++) {
        await wait(800 + i*200);
        try {
          const chk = await fetch(`/api/broadcast?txid=${encodeURIComponent(txid)}`);
          if (chk.ok) {
            const obj = await chk.json();
            if (obj.status === "CONFIRMED") { confirmed = true; break; }
          }
        } catch(e) {}
      }
      if (confirmed) showToast ? showToast("Confirmed ✅", "success") : null;
      else showToast ? showToast("Still pending — check explorer", "info") : null;

      // clean up
      setTo(""); setAmount("0.001");
    } catch (err) {
      console.error(err);
      showToast ? showToast("Send failed: " + err.message, "error") : alert("Send failed: " + err.message);
    } finally {
      setLoading(false); setStep(null);
    }
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <label className="text-sm text-gray-300">Recipient</label>
        <input value={to} onChange={e=>setTo(e.target.value)} placeholder="ST..." className="input mt-2" />
      </div>

      <div>
        <label className="text-sm text-gray-300">Amount (sBTC)</label>
        <input value={amount} onChange={e=>setAmount(e.target.value)} className="small-input mt-2" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" disabled={loading} className={`btn ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
          { loading ? (step ? step : "Processing...") : "Send sBTC" }
        </button>
        <button type="button" onClick={()=>{ setTo(""); setAmount("0.001"); }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl w-full sm:w-44">
          Reset
        </button>
      </div>
    </form>
  );
    }
