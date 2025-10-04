export default function Navbar({ onConnect, connected }) {
  return (
    <header className="nav">
      <div className="logo">sBTC Pay (Stacks × Turnkey)</div>
      <div>
        <button className="btn" onClick={onConnect}>
          {connected ? `Connected: ${connected.slice(0,8)}…` : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
