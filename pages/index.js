import Head from "next/head";
import { useState } from "react";
import WalletEmbed from "../components/WalletEmbed";
import SendCard from "../components/SendCard";
import TxLog from "../components/TxLog";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [logs, setLogs] = useState([]);

  function pushLog(m) {
    setLogs(l => [...l, `${new Date().toLocaleTimeString()} • ${m}`]);
  }

  function handleConnected(addr, meta) {
    setAccount({ address: addr, meta });
    pushLog(`Connected ${addr} (${meta?.mock ? "mock" : "turnkey"})`);
  }
  function handleBroadcasted(txid) {
    pushLog(`Broadcasted ${txid}`);
  }

  return (
    <>
      <Head>
        <title>sBTC Pay — Dami 🫰🏾</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#05060a] via-[#071021] to-[#07112a] text-white py-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">sBTC • Pay</h1>
              <p className="text-sm text-gray-400">Embedded wallet demo — mock & turnkey fallback</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-sm text-gray-300">Preview</div>
              <div className="text-xs text-gray-400">Dami 🫰🏾</div>
            </div>
          </header>

          {/* MAIN GRID: stacks on mobile, two-cols on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">
            {/* Left: main flow (stacked on mobile) */}
            <main>
              <div className="card mb-4">
                <h2 className="text-lg font-semibold">Wallet</h2>
                <div className="mt-4">
                  <WalletEmbed onConnected={handleConnected} />
                </div>
              </div>

              <div className="card">
                <SendCard wallet={account} onBroadcasted={handleBroadcasted} />
              </div>

              <div className="mt-4">
                <TxLog />
              </div>
            </main>

            {/* Right: sidebar (becomes full width under main on mobile) */}
            <aside className="space-y-4">
              <div className="card">
                <h3 className="font-semibold">Quick Info</h3>
                <p className="text-sm text-gray-300 mt-2">Use mock mode for mobile demos. For real Turnkey signing, use desktop or a security key.</p>
              </div>

              <div className="card">
                <h3 className="font-semibold">Last Action</h3>
                <p className="text-sm text-gray-300 mt-2">{logs.length ? logs[logs.length - 1] : "No actions yet"}</p>
              </div>
            </aside>
          </div>

          <footer className="mt-8 text-center text-sm text-gray-400">
            Crafted with ♥ by <span className="text-indigo-400 font-semibold">Dami 🫰🏾</span>
          </footer>
        </div>
      </div>
    </>
  );
              }
