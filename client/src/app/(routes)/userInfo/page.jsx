"use client"

import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import GitHubCalendar from "react-github-calendar"
import { useEffect, useState } from "react"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState(null)

  const githubUsername = searchParams.get("username") || "torvalds"

  useEffect(() => {
    setUserData({
      name: githubUsername.charAt(0).toUpperCase() + githubUsername.slice(1),
      email: `${githubUsername}@example.com`,
      phone: "+1 (555) 123-4567",
      github: githubUsername,
      linkedin: githubUsername,
    })
  }, [githubUsername])

  if (!userData) return null

  return (
    <div className="relative pt-[15vh] flex min-h-screen w-full items-center justify-center bg-black p-5">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

      {/* Radial gradient fade effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-black" />

      {/* Profile container */}
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Header section with name and title */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">{userData.name}</h1>
          <p className="mt-2 text-sm text-gray-400">Developer Profile</p>
        </div>

        {/* Info cards grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email Card */}
          <div className="group rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</p>
            <p className="mt-3 font-mono text-white break-all">{userData.email}</p>
          </div>

          {/* Phone Card */}
          <div className="group rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</p>
            <p className="mt-3 font-mono text-white">{userData.phone}</p>
          </div>

          {/* GitHub Card */}
          <div className="group rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">GitHub</p>
            <a
              href={`https://github.com/${userData.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              @{userData.github}
            </a>
          </div>

          {/* LinkedIn Card */}
          <div className="group rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">LinkedIn</p>
            <a
              href={`https://linkedin.com/in/${userData.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {userData.linkedin}
            </a>
          </div>
        </div>

        <div className="rounded-lg border border-gray-800 bg-black/50 p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Contribution Graph</h2>
            <p className="mt-1 text-sm text-gray-400">Last 365 days from GitHub</p>
          </div>

          <div className="overflow-x-auto flex justify-center">
            <style>{`
              .react-activity-calendar {
                color: #e5e7eb;
                font-family: inherit;
              }
              .react-activity-calendar text {
                fill: #9ca3af;
                font-size: 12px;
              }
              .react-activity-calendar rect {
                stroke: #374151;
                stroke-width: 1px;
              }
              .react-activity-calendar .level-0 { fill: #1f2937; }
              .react-activity-calendar .level-1 { fill: #06b6d4; opacity: 0.4; }
              .react-activity-calendar .level-2 { fill: #06b6d4; opacity: 0.6; }
              .react-activity-calendar .level-3 { fill: #06b6d4; opacity: 0.8; }
              .react-activity-calendar .level-4 { fill: #06b6d4; opacity: 1; }
            `}</style>
            <GitHubCalendar username={githubUsername} colorScheme="dark" />
          </div>
        </div>
      </div>
    </div>
  )
}
