import { useEffect, useState } from "react";
import { showToast } from "./ToastRoot";

export default function WalletEmbed({ onConnected }) {
  const [mode, setMode] = useState("auto"); // 'turnkey' | 'mock'
  const [addr, setAddr] = useState(null);
  const isAndroid = typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent);

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_TURNKEY_PROJECT_ID;
    if (id && id.length > 4 && !isAndroid) setMode("turnkey");
    else setMode("mock");
  }, [isAndroid]);

  function connectMock() {
    const a = "ST" + Math.random().toString(36).slice(2,16).toUpperCase();
    setAddr(a);
    onConnected && onConnected(a, { mock: true });
    showToast && showToast("🔗 Mock wallet connected", "success");
  }

  async function connectTurnkey() {
    // placeholder — we swap in real SDK once you provide TURNKEY ID
    try {
      // Real SDK flow goes here
      alert("Turnkey connect not enabled in this demo build. Use Mock or desktop Turnkey.");
    } catch (e) {
      // fallback to mock
      connectMock();
    }
  }

  return (
    <div>
      {isAndroid && (
        <div className="p-3 mb-4 rounded-md bg-yellow-900 bg-opacity-20 border border-yellow-700 text-yellow-200 text-sm">
          Android detected — Turnkey attestation sometimes fails on mobile (android-key). For reliable registration use a desktop browser or a FIDO2 security key (YubiKey), or use the Mock connect button below.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {mode === "turnkey" ? (
          <button onClick={connectTurnkey} className="btn">Connect Turnkey Wallet</button>
        ) : (
          <>
            <button onClick={connectMock} className="btn">Connect (Mock Wallet)</button>
            <div className="text-xs text-gray-400">Demo mode: use Mock to demo on mobile. For real signing use desktop or a hardware security key.</div>
          </>
        )}

        {addr && <div className="mt-2 font-mono text-sm text-teal-300 break-all">{addr}</div>}
      </div>
    </div>
  );
        }
