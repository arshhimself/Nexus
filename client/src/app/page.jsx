"use client"
import React from "react";
import { useRouter } from 'next/navigation'
import { BackgroundBeams } from "@/components/ui/background-beams";



function Hero() {
  const router = useRouter()
    const handleClick = () => {
    router.push('/join_community')
  }
  return (
    <section id="home" className="h-[100vh] flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-3xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 tracking-tight">
          Building a culture of collaborative growth
        </h1>
        <br></br>
        <p className="mt-4 text-neutral-400 max-w-2xl mx-auto text-sm md:text-lg">
          Nexus Community connects curious minds, mentors, and innovators to
          collaborate, discuss, and grow together — an open space where learning
          is driven by connection and curiosity.
        </p>
        <br></br>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
        onClick={handleClick}
            className="inline-flex items-center px-5 py-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 active:scale-95 transform transition shadow-md text-neutral-900 text-sm"
          >
            Join the Community
          </button>
          <a
            href="#about"
            className="inline-flex items-center px-4 py-3 rounded-lg border border-neutral-700 text-neutral-200 hover:border-neutral-600 transition text-sm"
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
    <section className="py-14">
      <div className="max-w-4xl mx-auto px-6">
        <div className="p-8 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-800">
          <blockquote className="text-center text-neutral-200 italic">
            “Nexus Community made me realize how powerful open collaboration can
            be. I’ve learned more by sharing and discussing than ever before.”
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
        <div className="text-sm text-neutral-400">
          © 2025 Nexus Open Learning Community
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            aria-label="Twitter"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 19c7 0 11-5.8 11-10.8v-.5A7.6 7.6 0 0020 6a7.3 7.3 0 01-2.1.6A3.7 3.7 0 0019.4 4a7.4 7.4 0 01-2.4.9A3.7 3.7 0 0013 3c-2 0-3.6 1.8-3.2 3.8A10.4 10.4 0 014 4.6A3.7 3.7 0 005 10a3.6 3.6 0 01-1.7-.5v.1c0 1.8 1.3 3.3 3 3.6A3.7 3.7 0 015 15v.1c0 2 1.4 3.7 3.3 3.8A7.4 7.4 0 014 19" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.6-.8 1.9-1.3-.9-.1-1.8-.4-1.8-2.1 0-.5.2-1 .5-1.4-.1-.2-.6-1 .1-2.1 0 0 .4-.1 1.4.5.4-.1.9-.2 1.3-.2.5 0 1 .1 1.5.2 1-.6 1.4-.5 1.4-.5.7 1.1.2 1.9.1 2.1.3.4.5.9.5 1.4 0 1.7-.9 2-1.8 2.1.6.5 1 1.4 1 2.7v4c0 .3.2.7.8.6A12 12 0 0012 .5"></path>
            </svg>
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-neutral-400 hover:text-neutral-100 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 font-sans scroll-smooth">
        <BackgroundBeams/>

      <div className="relative">

        <main className="pt-20">
          <div className="max-w-6xl mx-auto">
            <Hero />
           

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
