export default function Navbar({ onConnect, connected }) {
  return (
    <header className="nav">
      <div className="logo">sBTC Pay</div>
      <div>
        <button className="btn" onClick={onConnect}>
          {connected ? `Connected: ${connected.slice(0,6)}…${connected.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
}
