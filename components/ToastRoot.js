import { useEffect } from "react";

export function showToast(msg, type = "info") {
  if (typeof window === "undefined") return;
  const root = document.getElementById("toast-root");
  if (!root) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  el.style.cssText = "padding:10px;border-radius:10px;color:white;margin-top:8px;background:rgba(0,0,0,0.6)";
  root.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}

export default function ToastRoot(){
  useEffect(()=>{},[]);
  return <div id="toast-root" style={{position:'fixed',right:20,bottom:20,zIndex:9999}} />;
}
