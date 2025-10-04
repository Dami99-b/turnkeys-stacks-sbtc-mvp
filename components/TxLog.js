export default function TxLog({ logs = [] }) {
  // also load local tx history
  let history = [];
  try { history = JSON.parse(localStorage.getItem('sbtc_history') || '[]').slice().reverse(); } catch(e){}

  return (
    <div className="card" style={{marginTop:16}}>
      <h4>Activity</h4>

      <div style={{marginTop:8}}>
        { logs.length === 0 && history.length === 0 ? (
          <div className="muted">No actions yet</div>
        ) : (
          <>
            { logs.slice().reverse().map((l,i) =>
              <div key={`log-${i}`} style={{padding:8,borderBottom:'1px solid rgba(255,255,255,0.02)'}}>{l}</div>
            )}
            { history.map((t, i) => (
              <div key={`tx-${i}`} style={{padding:10,borderBottom:'1px solid rgba(255,255,255,0.02)', display:'flex', justifyContent:'space-between', gap:8}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'monospace'}}>{t.txid || '—'}</div>
                  <div className="muted" style={{fontSize:13}}>{t.from} → {t.to} • {t.amount} sBTC</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:700}}>{t.status}</div>
                  {t.explorer && <a href={t.explorer} target="_blank" rel="noreferrer" style={{fontSize:12,color:'#9aa4b2'}}>Explorer</a>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
              }
