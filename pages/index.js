import { useState } from "react";
import Navbar from "../components/Navbar";
import WalletEmbed from "../components/WalletEmbed";
import TxModal from "../components/TxModal";
import { showToast } from "../components/ToastRoot";
import { txExplorerUrl } from "../lib/stacksClient";

export default function Home(){
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [to, setTo] = useState("");
  const [amt, setAmt] = useState("0.001");
  const [loading, setLoading] = useState(false);
  const [txInfo, setTxInfo] = useState(null);

  async function onConnected(addr){
    setAccount(addr);
    showToast("Connected " + addr, "success");
    // fetch balance via serverless endpoint
    try {
      const r = await fetch(`/api/health`);
      if (r.ok) {
        // optional: call a /api/balance?address=...
      }
    } catch(e){}
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
      // createJson should include payloadToSign { ... } or unsignedHex etc.
      // 2) sign payload using Turnkey client SDK (replace this mock with actual client sign)
      // TODO: TURNKEY client sign -> signedPayload
      const signedPayload = { mockSigned: true, signedBlob: 'SIGNED_PLACEHOLDER' };

      // 3) submit signed payload back to server to broadcast
      const submitRes = await fetch('/api/submit-signed-tx', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ signedPayload, original: createJson })
      });
      const submitJson = await submitRes.json();
      setTxInfo(submitJson);
      showToast('Tx submitted: ' + (submitJson.txId || submitJson.tx_id || 'ok'), 'success');
    } catch (err) {
      console.error(err);
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar onConnect={() => {/* open modal? we use WalletEmbed instead */}} connected={account} />
      <div className="container">
        <div className="card">
          <h2>Embedded sBTC Payments (MVP)</h2>
          <p className="muted">Connect your embedded Turnkey wallet and send sBTC on Stacks Testnet.</p>

          <div style={{marginTop:12}}>
            <WalletEmbed onConnected={onConnected} />
          </div>

          <div style={{marginTop:16}}>
            <label>Recipient</label>
            <input value={to} onChange={e=>setTo(e.target.value)} style={{width:'100%',padding:8,borderRadius:8,marginTop:6}} placeholder="Recipient STX/sBTC address" />
            <label style={{marginTop:8}}>Amount (sBTC)</label>
            <input value={amt} onChange={e=>setAmt(e.target.value)} style={{width:200,padding:8,borderRadius:8,marginTop:6}} />
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
