export default function Footer({twitter, linkedin, github, eth}) {
  return (
    <footer className="container mt-8 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div>Made with ❤️ by <span className="text-teal-300 font-semibold">Dami 🫰🏾</span></div>
      <div className="flex gap-3 items-center">
        <a href={twitter} target="_blank" rel="noreferrer" className="muted">X</a>
        <a href={linkedin} target="_blank" rel="noreferrer" className="muted">LinkedIn</a>
        <a href={github} target="_blank" rel="noreferrer" className="muted">GitHub</a>
        <div className="muted">ETH: <span className="font-mono text-xs">{eth}</span></div>
      </div>
    </footer>
  )
}
