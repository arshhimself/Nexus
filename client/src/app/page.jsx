"use client"
import React from "react";
import { useRouter } from 'next/navigation'
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Events } from "@/components/Events-component";
function Hero() {
  const router = useRouter()
  const handleClick = () => {
    router.push('/join_community')
  }
   return (
    <section
      id="home"
      className="relative flex items-center justify-center min-h-[100vh] px-6 py-20 sm:py-24"
    >
      {/* Soft gradient glow background */}
      
     
      {/* Content */}
      <div className=" w-full text-center mx-auto">
        {/* Heading */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-500 tracking-tight leading-[1.1] px-2 sm:px-4">
  Building a Culture of <br className="hidden sm:block" />
  Collaborative Growth
</h1>

        {/* Subtitle */}
       <p className="mt-6 sm:mt-8 text-neutral-400 text-xs sm:text-xs md:text-sm leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
  Nexus is an open community by the Computer Department of Rizvi College,
  bringing together students and mentors to learn, build, and grow through open collaboration.
</p>

        {/* Buttons */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <button
            onClick={handleClick}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-200 active:scale-95 transition transform shadow-lg text-sm sm:text-base font-medium"
          >
            Join the Community
          </button>

          <a
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-neutral-700 text-neutral-200 hover:border-neutral-500 transition text-sm sm:text-base font-medium"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="py-10 sm:py-14 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-800">
          <blockquote className="text-center text-neutral-200 italic text-base sm:text-lg leading-relaxed">
            "Nexus Community made me realize how powerful open collaboration can
            be. I've learned more by sharing and discussing than ever before."
          </blockquote>
          <cite className="mt-4 block text-center text-sm text-neutral-400">
            — A community contributor
          </cite>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-8 border-t border-neutral-800 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-400 text-center md:text-left">
          © 2025 Nexus Open Learning Community
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            aria-label="Twitter"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 19c7 0 11-5.8 11-10.8v-.5A7.6 7.6 0 0020 6a7.3 7.3 0 01-2.1.6A3.7 3.7 0 0019.4 4a7.4 7.4 0 01-2.4.9A3.7 3.7 0 0013 3c-2 0-3.6 1.8-3.2 3.8A10.4 10.4 0 014 4.6A3.7 3.7 0 005 10a3.6 3.6 0 01-1.7-.5v.1c0 1.8 1.3 3.3 3 3.6A3.7 3.7 0 015 15v.1c0 2 1.4 3.7 3.3 3.8A7.4 7.4 0 014 19" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6-.8 1.9-1.3-.9-.1-1.8-.4-1.8-2.1 0-.5.2-1 .5-1.4-.1-.2-.6-1 .1-2.1 0 0 .4-.1 1.4.5.4-.1.9-.2 1.3-.2.5 0 1 .1 1.5.2 1-.6 1.4-.5 1.4-.5.7 1.1.2 1.9.1 2.1.3.4.5.9.5 1.4 0 1.7-.9 2-1.8 2.1.6.5 1 1.4 1 2.7v4c0 .3.2.7.8.6A12 12 0 0012 .5"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5a2.5 2.5 0 11-.01 0zM3 8.98h3.96V21H3zM9.98 8.98H13v1.6h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.8 2.6 4.8 6V21h-3.96v-5.1c0-1.2 0-2.7-1.6-2.7-1.6 0-1.8 1.2-1.8 2.6V21H9.98z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

function FullPageLayout() {
  return (
    <div className="min-h-screen  bg-neutral-950 text-neutral-200 font-sans scroll-smooth overflow-x-hidden">
      <BackgroundBeams/>

      <div className="relative">
        <main>
          <div className=" mx-auto">
            <Hero />
            <Events></Events>

            <Testimonial />
            <Footer />
          </div>
        </main>
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        >
          <div className="w-full h-full bg-gradient-to-b from-transparent via-neutral-900 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export default FullPageLayout;