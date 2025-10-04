export default function Navbar({ onConnect, connected, owner }) {
  return (
    <div className="container flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-lg" />
        <div>
          <div className="brand-text">sBTC • Pay</div>
          <div className="muted text-xs">Stacks embedded wallet demo</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block muted text-sm">Built by {owner}</div>
        <button onClick={onConnect} className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-600 text-black font-semibold">
          {connected ? `${connected.slice(0,8)}…` : 'Connect'}
        </button>
      </div>
    </div>
  )
}
