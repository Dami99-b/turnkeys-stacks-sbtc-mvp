export default function Navbar({ onConnect, connected }) {
  return (
    <div className="nav container">
      <div className="logo">sBTC • Pay</div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <nav className="muted" style={{marginRight:12}}>Demo • Testnet</nav>
        <button className="btn small" onClick={onConnect}>
          { connected ? `${connected.slice(0,8)}…` : 'Connect Wallet' }
        </button>
      </div>
    </div>
  );
}
