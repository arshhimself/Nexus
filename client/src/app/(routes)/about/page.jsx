import React from 'react'
import { cn } from "@/lib/utils";

function Page() {
  return (
    <div className="relative flex flex-col min-h-screen w-full items-center justify-center bg-black px-6 py-16">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      {/* Radial gradient overlay */}
<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Main content container */}
      <div className="relative z-20 w-full max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="relative z-20 bg-gradient-to-b from-neutral-300 to-neutral-600 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
            About Nexus
          </h1>
        </div>

        {/* Glass card container */}
        <div className="relative">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Content */}
            <div className="relative space-y-8">
              {/* First paragraph */}
              <div className="group">
                <p className="text-neutral-300 leading-relaxed text-lg md:text-xl font-light tracking-wide">
                  <span className="text-white font-medium">Nexus</span> is an open-source community initiative by the{' '}
                  <span className="text-white font-medium bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                    Computer Department of Rizvi College of Engineering (RCOE)
                  </span>. It was founded with a vision to empower students through collaboration, innovation, and the spirit of open source.
                </p>
              </div>

              {/* Second paragraph */}
              <div className="group">
                <p className="text-neutral-300 leading-relaxed text-lg md:text-xl font-light tracking-wide">
                  Our mission is to create an inclusive environment where learners, developers, and creators come together to build real-world projects,
                  share knowledge, and contribute to the open-source ecosystem. We believe in learning by doing, growing through community, and making
                  technology accessible for everyone.
                </p>
              </div>


              {/* Fourth paragraph */}
              <div className="group">
                <p className="text-neutral-300 leading-relaxed text-lg md:text-xl font-light tracking-wide">
                  Together, we are shaping the next generation of open-source contributors and developers — building not just software, but a
                  community driven by curiosity, integrity, and the passion to make an impact.
                </p>
              </div>
            </div>
          </div>

          {/* Floating glow effects */}
          <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  )
}

export default Page
