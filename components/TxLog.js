export default function TxLog({ entries=[] }) {
  return (
    <div className="card" style={{marginTop:12}}>
      <h4>Transaction Log</h4>
      <div style={{fontFamily:'monospace', fontSize:13}}>
        {entries.length === 0 ? <div className="muted">No logs yet</div> :
          entries.slice().reverse().map((e,i)=>(
            <div key={i} style={{padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.02)'}}>{e}</div>
          ))
        }
      </div>
    </div>
  );
}
