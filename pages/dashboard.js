import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";

export default function Dashboard(){
  return (
    <>
      <Head><title>Dashboard — Dami</title></Head>
      <Navbar onConnect={()=>{}} owner={process.env.NEXT_PUBLIC_OWNER || 'Dami'} />
      <main className="container mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Portfolio">
            <div className="muted">Mock balances & positions</div>
            <div className="mt-3 text-xl font-semibold">0.247 sBTC</div>
          </DashboardCard>

          <DashboardCard title="Orders">
            <div className="muted">Recent mock orders</div>
            <div className="mt-2">No orders yet</div>
          </DashboardCard>
        </div>
      </main>

      <Footer twitter={process.env.NEXT_PUBLIC_TWITTER} linkedin={process.env.NEXT_PUBLIC_LINKEDIN} github={process.env.NEXT_PUBLIC_GITHUB} eth={process.env.NEXT_PUBLIC_ETH} />
    </>
  )
}
