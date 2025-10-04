import { useState } from "react";
import Navbar from "../components/Navbar";
import WalletEmbed from "../components/WalletEmbed";
import TxModal from "../components/TxModal";
import { showToast } from "../components/ToastRoot";
import { txExplorerUrl } from "../lib/stacksClient";

export default function Home(){
  const [account, setAccount] = useState(null);
  const [to, setTo] = useState("");
  const [amt, setAmt] = useState("0.001");
  const [loading, setLoading] = useState(false);
  const [txInfo, setTxInfo] = useState(null);

  async function onConnected(addr){
    setAccount(addr);
    showToast("Connected " + addr, "success");
  }

  async function handleSend(){
    if (!account) return showToast("Connect wallet first", "error");
    if(!to) return showToast("Add recipient", "error");
    setLoading(true);
    try {
      // 1) create unsigned payload on server
      const createRes = await fetch('/api/create-sbtc-tx', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ from: account, to, amount: amt })
      });
      const createJson = await createRes.json();
      if (createJson.error) throw new Error(createJson.error);

      // 2) Mock signing step (replace with Turnkey client sign)
      const signedPayload = { mockSigned: true, signedBlob: 'SIGNED_PLACEHOLDER' };

      // 3) submit signed payload back to server to broadcast
      const submitRes = await fetch('/api/submit-signed-tx', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ signedPayload, original: createJson })
      });
      const submitJson = await submitRes.json();
      if (submitJson.error) throw new Error(submitJson.error);

      setTxInfo(submitJson);
      showToast('Tx submitted: ' + (submitJson.txId || 'ok'), 'success');

      // Save to local history for dashboard
      const h = JSON.parse(localStorage.getItem('sbtc_history') || '[]');
      h.push({ to, amount: amt, tx: submitJson.txId || 'MOCK_TX' });
      localStorage.setItem('sbtc_history', JSON.stringify(h));
    } catch (err) {
      console.error(err);
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar onConnect={() => {}} connected={account} />
      <div className="container">
        <div className="card">
          <h2>Embedded sBTC Payments (MVP)</h2>
          <p className="muted">Mock Turnkey wallet — real UX for your demo.</p>

          <div style={{marginTop:12}}>
            <WalletEmbed onConnected={onConnected} />
          </div>

          <div style={{marginTop:16}}>
            <label>Recipient</label>
            <input className="input" value={to} onChange={e=>setTo(e.target.value)} placeholder="Recipient STX address" />
            <label style={{marginTop:8}}>Amount (sBTC)</label>
            <input className="small-input" value={amt} onChange={e=>setAmt(e.target.value)} />
            <div style={{marginTop:12}}>
              <button className="btn" onClick={handleSend} disabled={loading}>{loading ? 'Sending…' : 'Send sBTC'}</button>
            </div>
          </div>
        </div>

        {txInfo && (
          <div style={{marginTop:16}}>
            <div className="card">
              <h4>Last Tx</h4>
              <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(txInfo, null, 2)}</pre>
              {txInfo.txId && <a href={txExplorerUrl(txInfo.txId)} target="_blank" rel="noreferrer">View on Explorer</a>}
            </div>
          </div>
        )}
      </div>
    </>
  );
                      }
