import { useState, useEffect } from "react";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState([]);
  const [toast, setToast] = useState("");

  // simple toast system
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // mock connect (for now)
  const connectMock = async () => {
    setAddress("SP2E49D363B670P1RTGZRP8F4TJAS7JSME9GM8PCY");
    setConnected(true);
    showToast("Wallet connected");
  };

  // fetch balance (Stacks testnet)
  const fetchBalance = async (addr) => {
    try {
      const res = await fetch(`https://api.testnet.hiro.so/extended/v1/address/${addr}/balances`);
      const data = await res.json();
      const stx = data?.stx?.balance / 1_000_000 || 0;
      setBalance(stx);
    } catch (e) {
      console.error(e);
      setBalance(0);
    }
  };

  useEffect(() => {
    if (connected && address) fetchBalance(address);
  }, [connected, address]);

  async function handleSend(e) {
    e.preventDefault();
    const to = e.target.recipient.value.trim();
    const amount = e.target.amount.value.trim();
    if (!to || !amount) return showToast("Fill all fields");
    showToast("⏳ Sending...");

    try {
      const r = await fetch("/api/sendTx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, amount }),
      });
      const data = await r.json();

      if (data.txid) {
        showToast("✅ Sent! TX: " + data.txid);
        setTxs((t) => [
          { txid: data.txid, type: "send", amount, status: data.status },
          ...t,
        ]);
      } else {
        showToast("❌ " + (data.error || "Error sending"));
      }
    } catch (err) {
      showToast("❌ Error sending tx");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-purple-400">
          Dami Embedded Wallet
        </h1>
        <p className="text-gray-400">
          sBTC • Stacks • Turnkey Integration (Server-side signing)
        </p>
      </header>

      {!connected ? (
        <button
          onClick={connectMock}
          className="bg-purple-500 hover:bg-purple-600 transition px-8 py-3 rounded-lg text-lg font-medium"
        >
          Connect Mock Wallet
        </button>
      ) : (
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800">
          <div className="mb-4">
            <p className="text-sm text-gray-400">Connected as:</p>
            <p className="font-mono break-all text-sm text-purple-300">{address}</p>
          </div>

          <div className="mb-6">
            <p className="text-lg">
              Balance:{" "}
              <span className="text-2xl font-bold text-green-400">
                {balance.toFixed(3)} STX
              </span>
            </p>
          </div>

          <form onSubmit={handleSend} className="mb-6">
            <input
              name="recipient"
              placeholder="Recipient (ST...)"
              className="w-full p-3 rounded bg-gray-800 text-sm mb-3 focus:outline-none border border-gray-700 focus:border-purple-400"
            />
            <input
              name="amount"
              placeholder="Amount (STX)"
              type="number"
              step="0.000001"
              className="w-full p-3 rounded bg-gray-800 text-sm mb-3 focus:outline-none border border-gray-700 focus:border-purple-400"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg font-semibold"
            >
              Send Transaction
            </button>
          </form>

          <div>
            <h2 className="font-semibold mb-2 text-purple-300">Recent Transactions</h2>
            {txs.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            ) : (
              <ul className="text-sm space-y-2">
                {txs.map((t, i) => (
                  <li key={i} className="bg-gray-800/60 p-3 rounded-md">
                    <p>
                      <span className="text-gray-400">TXID:</span>{" "}
                      <a
                        href={`https://explorer.testnet.stacks.co/txid/${t.txid}`}
                        className="text-blue-400 hover:underline break-all"
                        target="_blank"
                      >
                        {t.txid}
                      </a>
                    </p>
                    <p className="text-gray-400">
                      Amount: <span className="text-white">{t.amount}</span> STX |{" "}
                      <span className="text-green-400">{t.status}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <footer className="mt-12 text-sm text-gray-500 text-center space-y-1">
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://x.com/damillz?t=Lt1K1-KaX-iVLDmgqCCH2w&s=09"
            target="_blank"
            className="text-purple-400 hover:underline"
          >
            Dami
          </a>
        </p>
        <div className="flex justify-center space-x-3 text-purple-400">
          <a href="https://github.com/Dami99-b" target="_blank">GitHub</a>
          <a href="https://www.linkedin.com/in/prosper-okah-150672372" target="_blank">LinkedIn</a>
          <span>·</span>
          <a href="#" className="text-gray-400 font-mono">0xadc1866530B221AD80D77ba97EFa6888C1277418</a>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
        }
