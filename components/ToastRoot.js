import { useEffect } from "react";

export function showToast(msg, type='info') {
  if (typeof window === 'undefined') return;
  const root = document.getElementById('toast-root');
  if (!root) return alert(msg);
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = "background:rgba(0,0,0,0.7);padding:10px;border-radius:10px;color:white;margin-top:8px";
  root.appendChild(el);
  setTimeout(()=> el.remove(), 3500);
}

export default function ToastRoot(){
  useEffect(()=>{},[]);
  return <div id="toast-root" style={{position:'fixed',right:20,bottom:20,zIndex:9999}} />
}
