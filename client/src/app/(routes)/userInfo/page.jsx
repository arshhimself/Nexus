"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import GitHubCalendar from "react-github-calendar"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext";
import { LoaderOne } from "@/components/ui/loader";
export default function ProfilePage() {
        const { isLoggedIn, logout } = useAuth();
    

  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")

      
      if (!token) {
        router.push("/login")
        return
      }
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/authentication/user`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        })
        console.log("Fetch response status:", response.status)

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUserData(data)
      } catch (err) {
        setError(err.message)
        console.log("Error fetching user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const extractGitHubUsername = (githubUrl) => {
    if (!githubUrl) return "torvalds"
    const match = githubUrl.match(/github\.com\/([^/]+)/)
    return match ? match[1] : "torvalds"
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-5">
 <LoaderOne />;
       
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-5">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-black" />
        <div className="relative z-10 text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (!userData) return null

  const githubUsername = extractGitHubUsername(userData.github)

  return (
    <div className="relative flex pt-[15vh] min-h-screen w-full flex-col items-center justify-start bg-black p-5">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

      {/* Radial fade */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-black" />

      {/* Profile Content */}
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">{userData.name}</h1>
          <p className="mt-2 text-sm text-gray-400">Developer Profile</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard label="Email" value={userData.email} href={`mailto:${userData.email}`} />
          <InfoCard label="Phone" value={userData.phone} href={`tel:${userData.phone}`} />
          <InfoCard
            label="GitHub"
            value={`@${githubUsername}`}
            href={userData.github}
          />
          <InfoCard
            label="LinkedIn"
            value={userData.linkedin.split("/in/")[1] || userData.linkedin}
            href={userData.linkedin}
          />
        </div>

        {/* GitHub Contribution Graph */}
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

        {/* Logout Button */}
        <div className="flex justify-center pt-10">
          <button
            onClick={() => {
  logout();
  router.push("/");
}}

            className="px-6 py-3 text-sm font-semibold text-cyan-400 border border-cyan-400/40 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 backdrop-blur-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ label, value, href }) {
  return (
    <div className="group rounded-lg border border-gray-800 bg-black/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block font-mono text-cyan-400 hover:text-cyan-300 transition-colors break-all"
      >
        {value}
      </a>
    </div>
  )
}
