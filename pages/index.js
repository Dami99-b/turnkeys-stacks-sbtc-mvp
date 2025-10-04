import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WalletEmbed from "../components/WalletEmbed";
import SendCard from "../components/SendCard";
import TxLog from "../components/TxLog";
import { explorerForTx } from "../lib/stacksClient";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [logs, setLogs] = useState([]);
  const [lastTx, setLastTx] = useState(null);

  function pushLog(m){ setLogs(l => [...l, `${new Date().toLocaleTimeString()} • ${m}`]); }

  function handleConnected(addr, meta) {
    setAccount(addr);
    pushLog(`Connected ${addr} (${meta?.mock ? 'mock' : 'turnkey'})`);
  }

  function handleBroadcasted(txid) {
    setLastTx(txid);
    pushLog(`Broadcasted tx ${txid}`);
  }

  return (
    <>
      <Navbar onConnect={()=>{}} connected={account} />
      <Hero onQuickClaim={() => { if (!account) return pushLog('Wallet not connected'); pushLog('Quick demo send (mock)'); }} />
      <div className="container" style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20,marginTop:20}}>
        <div>
          <div className="card" style={{marginBottom:16}}>
            <h3>Wallet</h3>
            <div style={{marginTop:12}}>
              <WalletEmbed onConnected={handleConnected} />
            </div>
          </div>

          <SendCard account={account} onBroadcasted={handleBroadcasted} />
          { lastTx && (
            <div className="card" style={{marginTop:12}}>
              <div>Last tx: <a href={explorerForTx(lastTx)} target="_blank" rel="noreferrer">{lastTx}</a></div>
            </div>
          )}
          <TxLog logs={logs} />
        </div>

        <aside>
          <div className="card">
            <h4>Why sBTC?</h4>
            <p className="muted">sBTC brings Bitcoin liquidity into Stacks apps. Embedded wallets let users transact seamlessly without leaving the app.</p>
          </div>
          <div style={{height:12}} />
          <div className="card">
            <h4>Demo Notes</h4>
            <p className="muted">This demo uses mock signing unless you provide Turnkey Project ID. Desktop recommended for initial Turnkey registration.</p>
          </div>
        </aside>
      </div>
    </>
  );
  }
