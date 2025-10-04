import React from 'react'

export default function Header() {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-gray-900 via-gray-950 to-black shadow-lg">
      <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400 animate-pulse">
        ▸▸ DΛMI • sBTC • ᔑ DΛPP ◂◂
      </div>
      <nav className="mt-4 md:mt-0 flex gap-4 text-sm md:text-base text-gray-300">
        <a href="https://x.com/damillz?t=Lt1K1-KaX-iVLDmgqCCH2w&s=09" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">X/Twitter</a>
        <a href="https://www.linkedin.com/in/prosper-okah-150672372?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
        <a href="https://github.com/Dami99-b/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
      </nav>
    </header>
  )
}
