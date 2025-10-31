'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from "@/app/context/AuthContext";
export default function NavBar() {
    const { isLoggedIn, logout } = useAuth();

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => setIsOpen(!isOpen)
  
  const handleNavigation = (path) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <nav className="max-w-5xl mx-auto px-4 sm:px-8 py-5">
          <div className="relative w-full h-14 rounded-lg overflow-hidden">
            {/* Clear glass with minimal blur */}
            <div className="absolute inset-0 backdrop-blur-sm bg-white/[0.01]" />
            
            {/* Refraction highlight on edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] via-transparent to-white/[0.05]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
            
            {/* Crystal clear border */}
            <div className="absolute inset-0 rounded-lg border border-white/10" />
            
            {/* Content */}
            <div className="relative w-full h-full flex items-center justify-between px-4 sm:px-8">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => handleNavigation('/')}
              >
                <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-white/40">
                  <span className="text-white font-light text-sm">N</span>
                </div>
                <span className="text-white font-light text-base tracking-widest">NEXUS</span>
              </div>
              
              {/* Desktop Navigation */}
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
              
              {/* Desktop Action */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => router.push('/login')}
                  className="text-white text-xs font-light tracking-widest uppercase transition-colors duration-500 hover:text-white/80"
                >
                  Login
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden text-white/80 hover:text-white transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-neutral-950 border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Glass effect on sidebar */}
        <div className="absolute inset-0 backdrop-blur-sm bg-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
        
        <div className="relative h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center">
                <span className="text-white font-light text-sm">N</span>
              </div>
              <span className="text-white font-light text-base tracking-widest">NEXUS</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-6">
              <li>
                <button
                  onClick={() => handleNavigation('/')}
                  className="w-full text-left text-white/60 hover:text-white text-sm font-light tracking-widest uppercase transition-colors duration-300 py-2"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="w-full text-left text-white/60 hover:text-white text-sm font-light tracking-widest uppercase transition-colors duration-300 py-2"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/events')}
                  className="w-full text-left text-white/60 hover:text-white text-sm font-light tracking-widest uppercase transition-colors duration-300 py-2"
                >
                  Events
                </button>
              </li>
            </ul>
          </nav>

          {/* Sidebar Footer */}
          
          {
  isLoggedIn ? (
    <div className="p-6 border-t border-white/10">
      <button
        onClick={logout}
        className="w-full py-3 px-6 rounded-lg border border-white/20 text-white text-sm font-light tracking-widest uppercase transition-all duration-300 hover:bg-white/5 hover:border-white/30"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="p-6 border-t border-white/10">
      <button
        onClick={() => handleNavigation('/login')}
        className="w-full py-3 px-6 rounded-lg border border-white/20 text-white text-sm font-light tracking-widest uppercase transition-all duration-300 hover:bg-white/5 hover:border-white/30"
      >
        Login
      </button>
    </div>
  )
}

        </div>
      </aside>
    </>
  )
}