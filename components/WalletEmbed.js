import { useEffect, useState } from "react";
import { showToast } from "./ToastRoot";

export default function WalletEmbed({ onConnected }) {
  const [mode, setMode] = useState('detect'); // 'turnkey' or 'mock'
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_TURNKEY_PROJECT_ID;
    if (id && id.length > 3) setMode('turnkey'); else setMode('mock');
  }, []);

  function connectMock() {
    const a = 'ST' + Math.random().toString(36).slice(2,16).toUpperCase();
    setAddress(a);
    showToast('🔗 Mock wallet connected: ' + a, 'success');
    onConnected(a, { mock: true });
  }

  async function connectTurnkey() {
    // TODO: full Turnkey connect flow — I'll add this when you provide Project ID.
    alert('Turnkey connect placeholder — provide Project ID for full integration.');
  }

  return (
    <div>
      {mode === 'turnkey' ? (
        <div>
          <button className="btn small" onClick={connectTurnkey}>Connect Turnkey Wallet</button>
          <p className="muted" style={{marginTop:8}}>Turnkey mode — use desktop for initial registration if you hit Android attestation error.</p>
        </div>
      ) : (
        <div>
          <button className="btn small" onClick={connectMock}>Connect (mock)</button>
          <p className="muted" style={{marginTop:8}}>Mock wallet — use this for fast demos.</p>
          {address && <div style={{marginTop:8,fontFamily:'monospace'}}>{address}</div>}
        </div>
      )}
    </div>
  );
}
