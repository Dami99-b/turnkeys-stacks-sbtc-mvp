import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Dashboard(){
  const [history, setHistory] = useState([]);
  useEffect(()=> {
    // load mem or call server endpoint for tx history
    const h = JSON.parse(localStorage.getItem('sbtc_history') || '[]');
    setHistory(h);
  },[]);
  return (
    <>
      <Navbar onConnect={()=>{}} connected={null}/>
      <div className="container">
        <div className="card">
          <h2>Transaction History</h2>
          {history.length === 0 ? <p className="muted">No transactions yet</p> : (
            <table style={{width:'100%'}}>
              <thead><tr><th>To</th><th>Amount</th><th>Tx</th></tr></thead>
              <tbody>{history.map((r,i)=>(
                <tr key={i}><td>{r.to}</td><td>{r.amount}</td><td>{r.tx}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
