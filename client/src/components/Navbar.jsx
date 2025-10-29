'use client'
import { useRouter } from 'next/navigation'
import GlassSurface from './GlassSurface'

export default function NavBar() {
  const router = useRouter()

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="max-w-5xl mx-auto px-8 py-5">
        <GlassSurface
          width="100%"
          height={56}
          borderRadius={8}
          borderWidth={0.03}
          brightness={180}
          opacity={0.05}
          blur={8}
          backgroundOpacity={0.04}
          className="border border-white/8"
        >
          <div className="w-full flex items-center justify-between px-8">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center">
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
                className="text-white text-xs font-light tracking-widest uppercase transition-colors duration-500 hidden md:block"
              >
                Login
              </button>
            </div>
          </div>
        </GlassSurface>
      </nav>
    </header>
  )
}
