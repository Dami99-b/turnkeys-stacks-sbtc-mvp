export default function TxModal({ open, txInfo, onClose }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)"}}>
      <div style={{background:"#071225",padding:20,borderRadius:12,minWidth:320}}>
        <h3>Transaction</h3>
        <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(txInfo,null,2)}</pre>
        <div style={{textAlign:"right"}}>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
