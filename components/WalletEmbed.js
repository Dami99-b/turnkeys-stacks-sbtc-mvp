import { useEffect, useState } from "react";
import { showToast } from "./ToastRoot";

export default function WalletEmbed({ onConnected }) {
  const [mode, setMode] = useState('auto'); // 'turnkey' or 'mock'
  const [addr, setAddr] = useState(null);
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  useEffect(()=> {
    const id = process.env.NEXT_PUBLIC_TURNKEY_PROJECT_ID;
    if (id && !isAndroid) setMode('turnkey');
    else setMode('mock');
  }, [isAndroid]);

  function connectMock(){
    const a = 'ST' + Math.random().toString(36).slice(2,16).toUpperCase();
    setAddr(a);
    onConnected && onConnected(a, { mock: true });
    showToast('🔗 Mock wallet connected', 'success');
  }

  async function connectTurnkey(){
    // placeholder: real turnkey SDK will replace here
    try {
      alert('Turnkey not enabled for this demo. Use Mock or run Turnkey on desktop.');
    } catch(e){
      connectMock();
    }
  }

  return (
    <div>
      {isAndroid && <div className="card mb-4 text-yellow-200" style={{background:'rgba(80,50,0,0.08)'}}>
        Mobile detected — Turnkey attestation sometimes fails on Android. Use desktop or mock for demo.
      </div>}
      <div className="flex flex-col gap-3">
        { mode === 'turnkey' ? (
          <button onClick={connectTurnkey} className="btn">Connect Turnkey Wallet</button>
        ) : (
          <>
            <button onClick={connectMock} className="btn">Connect (Mock Wallet)</button>
            <div className="muted text-xs">Mock mode: works instantly on mobile for demo.</div>
            {addr && <div className="font-mono mt-2 text-teal-300 break-all">{addr}</div>}
          </>
        )}
      </div>
    </div>
  )
          }
