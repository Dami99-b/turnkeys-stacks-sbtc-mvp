import { useEffect, useState } from 'react';
import { showToast } from './toast'; // small helper if you include it; else use alert()

export default function WalletEmbed({ onConnected }) {
  const [mode, setMode] = useState('auto'); // 'turnkey' or 'mock'
  const [addr, setAddr] = useState(null);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_TURNKEY_PROJECT_ID;
    if (id && id.length > 3) setMode('turnkey');
    else setMode('mock');
  }, []);

  // MOCK connect (fast demo)
  function connectMock() {
    const a = 'ST' + Math.random().toString(36).slice(2,18).toUpperCase();
    setAddr(a);
    onConnected(a, { mock: true });
    showToast && showToast('🔗 Mock wallet connected: ' + a, 'success');
  }

  // REAL Turnkey flow (placeholder) — we will replace this with turnkey SDK code
  // after you provide NEXT_PUBLIC_TURNKEY_PROJECT_ID.
  async function connectTurnkey() {
    // TODO: Replace with Turnkey client init code e.g.
    // import { TurnkeyProvider, useTurnkey } from '@turnkey/react-wallet-kit';
    // then call connect() from SDK and call onConnected(address, { turnkey: true, sdkUser })
    // See Turnkey docs for exact client API. 4
    alert('Turnkey connect placeholder — provide Project ID and I will finish integration.');
  }

  return (
    <div>
      {mode === 'turnkey' ? (
        <div>
          <button className="btn" onClick={connectTurnkey}>Connect Turnkey Wallet</button>
          <div className="muted" style={{marginTop:8}}>Turnkey mode — please provide Project ID & install SDK to enable real signing.</div>
        </div>
      ) : (
        <div>
          <button className="btn" onClick={connectMock}>Connect (mock)</button>
          <div className="muted" style={{marginTop:8}}>Using mock embedded wallet (demo mode)</div>
        </div>
      )}
    </div>
  );
}
