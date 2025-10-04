import { useState, useEffect } from "react";

export default function Dashboard() {
  const [address, setAddress] = useState(
    "SP2E49D363B670P1RTGZRP8F4TJAS7JSME9GM8PCY"
  );
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState([]);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  // DEX states
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapToken, setSwapToken] = useState("STX");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`
      );
      const data = await res.json();
      const stx = data?.stx?.balance / 1_000_000 || 0;
      setBalance(stx);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTxs = async () => {
    try {
      const res = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/transactions`
      );
      const data = await res.json();
      setTxs(data.results.slice(0, 10));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTxs();
    const interval = setInterval(() => {
      fetchBalance();
      fetchTxs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const to = e.target.recipient.value.trim();
    const amount = e.target.amount.value.trim();
    if (!to || !amount) return showToast("Fill all fields");

    setSending(true);
    showToast("⏳ Sending transaction...");

    try {
      const r = await fetch("/api/sendTx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, amount }),
      });
      const data = await r.json();
      if (data.txid) {
        showToast("✅ Sent! TX: " + data.txid);
        fetchBalance();
        fetchTxs();
      } else {
        showToast("❌ " + (data.error || "Error"));
      }
    } catch (err) {
      showToast("❌ Error sending tx");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSwap = () => {
    if (!fromAmount) return showToast("Enter an amount to swap");
    // Mock swap logic: 1:1 rate for demonstration
    const received = parseFloat(fromAmount);
    setToAmount(received);
    showToast(`✅ Swapped ${fromAmount} sBTC → ${received} ${swapToken}`);
    setFromAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 text-purple-400">
          Dami Stacks Dashboard
        </h1>
        <p className="text-gray-400">sBTC • Stacks • Turnkey (Server-Side Signing)</p>
      </header>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* LEFT PANEL: Wallet Info */}
        <div className="flex-1 bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-purple-300 font-semibold mb-4">Wallet Info</h2>
          <p className="text-gray-400 text-sm">Connected Address:</p>
          <p className="font-mono break-all text-white mb-3">{address}</p>
          <p className="text-lg">
            Balance:{" "}
            <span className="text-2xl font-bold text-green-400">
              {balance.toFixed(3)} STX
            </span>
          </p>

          <form onSubmit={handleSend} className="mt-6 space-y-3">
            <input
              name="recipient"
              placeholder="Recipient (ST...)"
              className="w-full p-3 rounded bg-gray-800 text-sm focus:outline-none border border-gray-700 focus:border-purple-400"
            />
            <input
              name="amount"
              placeholder="Amount (STX)"
              type="number"
              step="0.000001"
              className="w-full p-3 rounded bg-gray-800 text-sm focus:outline-none border border-gray-700 focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg font-semibold"
            >
              {sending ? "Sending..." : "Send STX"}
            </button>
          </form>

          {/* DEX Mock Panel */}
          <div className="mt-8 p-4 bg-gray-800/60 rounded-xl">
            <h2 className="text-purple-300 font-semibold mb-3">Swap sBTC → {swapToken}</h2>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="Amount sBTC"
              className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:border-purple-400 mb-2"
            />
            <div className="flex justify-between mb-2 text-gray-400 text-sm">
              <span>To: {swapToken}</span>
              <span>Estimated: {toAmount}</span>
            </div>
            <button
              onClick={handleSwap}
              className="w-full bg-purple-600 hover:bg-purple-700 transition p-2 rounded-lg font-semibold"
            >
              Swap
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Recent Transactions */}
        <div className="flex-1 bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-800">
          <h2 className="text-purple-300 font-semibold mb-4">Recent Transactions</h2>
          {txs.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          ) : (
            <ul className="text-sm space-y-2 max-h-96 overflow-y-auto">
              {txs.map((t, i) => (
                <li key={i} className="bg-gray-800/60 p-3 rounded-md">
                  <p>
                    <span className="text-gray-400">TXID:</span>{" "}
                    <a
                      href={`https://explorer.testnet.stacks.co/txid/${t.tx_id}`}
                      className="text-blue-400 hover:underline break-all"
                      target="_blank"
                    >
                      {t.tx_id}
                    </a>
                  </p>
                  <p className="text-gray-400">
                    Status: <span className="text-green-400">{t.tx_status}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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
