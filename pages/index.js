import { useState } from "react";
import Head from "next/head";
import SendCard from "../components/SendCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [mockMode, setMockMode] = useState(true);

  const handleMockConnect = async () => {
    toast.info("Mock wallet connected (Demo Mode)");
    setWallet({
      address: "ST21TNQFNP7MF4F12HZSEFNSHA49VVAP8ZHXMNQWM",
      balance: "5.4321 sBTC",
      mode: "mock",
    });
  };

  const handleRealConnect = async () => {
    try {
      // Try initializing real Turnkey wallet (pseudo)
      toast.loading("Connecting to Turnkey...");
      // Placeholder for real connection
      throw new Error("android-key not supported");
    } catch (err) {
      toast.error("Real wallet connect failed — switching to Mock Mode");
      setMockMode(true);
      handleMockConnect();
    } finally {
      toast.dismiss();
    }
  };

  const handleConnect = () => {
    if (mockMode) handleMockConnect();
    else handleRealConnect();
  };

  const handleDisconnect = () => {
    setWallet(null);
    toast.info("Wallet disconnected");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-6">
      <Head>
        <title>Turnkey sBTC dApp | Dami 🫰🏾</title>
      </Head>

      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Turnkey x sBTC Wallet Demo
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Embedded Wallet Challenge • Stacks Builders 2025
        </p>

        {!wallet ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-semibold rounded-xl transition-all w-52 text-center"
              >
                {mockMode ? "Connect (Mock Wallet)" : "Connect Wallet"}
              </button>

              <button
                onClick={() => setMockMode(!mockMode)}
                className="text-sm text-gray-400 hover:text-teal-400 transition"
              >
                Switch to {mockMode ? "Real Wallet Mode" : "Mock Mode"}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full text-center">
              <p className="text-gray-300 text-sm mb-1">Connected Address:</p>
              <p className="font-mono text-teal-400 text-sm break-all">
                {wallet.address}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Balance: {wallet.balance}
              </p>
            </div>

            <SendCard wallet={wallet} />

            <button
              onClick={handleDisconnect}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-500 text-xs text-center">
        Crafted by <span className="text-teal-400 font-semibold">Dami 🫰🏾</span> • Powered by Turnkey SDK
      </footer>

      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
    }
