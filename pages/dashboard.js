import Navbar from "../components/Navbar";

export default function Dashboard(){
  return (
    <>
      <Navbar onConnect={()=>{}} connected={null} />
      <div className="container">
        <div className="card">
          <h2>Dashboard</h2>
          <p className="muted">Transaction history is stored locally in demo mode. Replace with backend storage for production.</p>
        </div>
      </div>
    </>
  );
}
