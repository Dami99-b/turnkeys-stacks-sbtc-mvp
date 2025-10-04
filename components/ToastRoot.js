import { useEffect } from "react";

export function showToast(msg, type="info") {
  if (typeof window === "undefined") return;
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

export default function ToastRoot(){
  useEffect(()=>{},[]);
  return <div id="toast-root" className="toast-container" />;
}
