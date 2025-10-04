export default function Hero({ onQuickClaim }) {
  return (
    <div className="container">
      <div className="hero-wrap">
        <div style={{flex:1}}>
          <h1>Bring Bitcoin-native payments to Stacks — embedded wallet UX</h1>
          <p className="muted" style={{marginTop:8}}>Fast sBTC transfers with Turnkey embedded wallet. Demo-mode works without keys — swap in Turnkey Project ID to enable real signing.</p>
          <div style={{marginTop:16,display:'flex',gap:12}}>
            <button className="btn" onClick={onQuickClaim}>Quick Demo Send</button>
            <a className="muted" href="/dashboard" style={{alignSelf:'center'}}>View Dashboard →</a>
          </div>
        </div>

        <div style={{width:360}}>
          <div className="card">
            <h3 style={{margin:0}}>Wallet</h3>
            <p className="muted" style={{marginTop:8}}>Connect an embedded wallet to start transacting</p>
            <div style={{marginTop:12}}>
              {/* WalletEmbed inserted in page */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  }
