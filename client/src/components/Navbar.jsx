'use client'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const router = useRouter()
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="max-w-5xl mx-auto px-8 py-5">
        <div className="relative w-full h-14 rounded-lg overflow-hidden">
          {/* Clear glass with minimal blur */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/[0.01]" />
          
          {/* Refraction highlight on edges */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-transparent to-white/[0.05]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
          
          {/* Crystal clear border */}
          <div className="absolute inset-0 rounded-lg border border-white/10" />
          
          {/* Content */}
          <div className="relative w-full h-full flex items-center justify-between px-8">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push('/')}
            >
              <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-white/40">
                <span className="text-white font-light text-sm">N</span>
              </div>
              <span className="text-white font-light text-base tracking-widest">NEXUS</span>
            </div>
            
            {/* Navigation */}
            <ul className="hidden md:flex items-center space-x-8">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="text-white/60 hover:text-white text-xs font-light tracking-widest uppercase transition-colors duration-500"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/about')}
                  className="text-white/60 hover:text-white text-xs font-light tracking-widest uppercase transition-colors duration-500"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/events')}
                  className="text-white/60 hover:text-white text-xs font-light tracking-widest uppercase transition-colors duration-500"
                >
                  Events
                </button>
              </li>
            </ul>
            
            {/* Action */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/login')}
                className="text-white text-xs font-light tracking-widest uppercase transition-colors duration-500 hidden md:block hover:text-white/80"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}