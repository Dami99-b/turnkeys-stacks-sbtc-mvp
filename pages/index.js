import Head from "next/head";
import { useState } from "react";
import Navbar from "../components/Navbar";
import WalletEmbed from "../components/WalletEmbed";
import DashboardCard from "../components/DashboardCard";
import Footer from "../components/Footer";
import ToastRoot, { showToast } from "../components/ToastRoot";
import { makeFakeTxId } from "../lib/stacksClient";

export default function Home() {
  const owner = process.env.NEXT_PUBLIC_OWNER || 'Dami';
  const [account, setAccount] = useState(null);
  const [txs, setTxs] = useState([]);
  const [balance, setBalance] = useState('0.247 sBTC');

  function handleConnected(addr, meta){
    setAccount({ address: addr, meta });
    showToast('Wallet connected: ' + addr);
  }

  async function quickSwapDemo(){
    if(!account) return showToast('Connect wallet first','error');
    showToast('Simulating swap: sBTC ↔ STX');
    const txid = makeFakeTxId();
    setTxs(t=> [{txid, type:'swap', amount:'0.002 sBTC', when: Date.now(), status:'CONFIRMED'}, ...t]);
  }

  return (
    <>
      <Head><title>sBTC • Pay — Dami</title></Head>
      <Navbar onConnect={()=>{}} connected={account?.address} owner={owner} />
      <main className="container mt-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6">
          <section>
            <DashboardCard title="Wallet">
              <WalletEmbed onConnected={handleConnected} />
              <div className="mt-4 flex gap-3">
                <div className="card">
                  <div className="muted">Balance</div>
                  <div className="text-xl font-semibold">{balance}</div>
                </div>
                <div className="card">
                  <div className="muted">Address</div>
                  <div className="font-mono text-xs break-all">{account?.address || 'Not connected'}</div>
                </div>
              </div>
            </DashboardCard>

            <div className="mt-6">
              <DashboardCard title="DEX-ish — Quick Actions">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={quickSwapDemo} className="btn w-full sm:w-auto">Quick Swap (demo)</button>
                  <button onClick={()=> showToast('Open orderbook (demo)')} className="btn w-full sm:w-auto">Orderbook</button>
                </div>
              </DashboardCard>
            </div>

            <div className="mt-6">
              <DashboardCard title="Recent Activity">
                {txs.length === 0 ? <div className="muted">No transactions yet</div> :
                  txs.map((t,i)=>(
                    <div key={i} className="p-3 border-b border-white/6">
                      <div className="font-mono text-xs">{t.txid}</div>
                      <div className="muted text-sm">{t.type} • {t.amount} • {t.status}</div>
                    </div>
                  ))
                }
              </DashboardCard>
            </div>
          </section>

          <aside>
            <DashboardCard title="Quick Send">
              <form onSubmit={e=>e.preventDefault()}>
                <input placeholder="Recipient (ST...)" className="input mb-2"/>
                <input placeholder="Amount (sBTC)" className="small-input mb-2"/>
                <button className="btn w-full">Send (demo)</button>
              </form>
            </DashboardCard>

            <div className="mt-4">
              <DashboardCard title="About">
                <p className="muted">This build simulates embedded wallet flows and live-like sBTC transactions. Replace mock signer with Turnkey SDK when ready.</p>
              </DashboardCard>
            </div>
          </aside>
        </div>

        <Footer
          twitter={process.env.NEXT_PUBLIC_TWITTER}
          linkedin={process.env.NEXT_PUBLIC_LINKEDIN}
          github={process.env.NEXT_PUBLIC_GITHUB}
          eth={process.env.NEXT_PUBLIC_ETH}
        />
      </main>

      <ToastRoot />
      <div className="footer-tag">Dami 🫰🏾</div>
    </>
  )
                    }
