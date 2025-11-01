"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { LoaderOne } from "@/components/ui/loader";

export default function LeaderboardPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://${process.env.NEXT_PUBLIC_DJANGO_URL}/api/quiz/results/`)
        if (!res.ok) throw new Error("Failed to fetch results")
        const result = await res.json()

        // Sort by avg_score descending
        const sorted = result
          .filter((item) => item.avg_score !== null)
          .sort((a, b) => b.avg_score - a.avg_score)
          .map((item, index) => ({
            rank: index + 1,
            name: item.user,
            points: item.avg_score.toFixed(2),
          }))

        setData(sorted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-4 lg:pt-[10vh] sm:p-6">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]"
        )}
      />

      {/* Soft white glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl" />

      {/* Mask fade */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)] bg-black" />

      {/* Leaderboard */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
            Leaderboard
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-400">Top performers</p>
        </div>

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/50 z-50">
  <div className="flex flex-col items-center">
    <LoaderOne />
    <p className="mt-4 text-gray-300 text-sm tracking-wide">
      Loading leaderboard...
    </p>
  </div>
</div>

        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-lg shadow-[0_0_60px_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-[0_0_80px_rgba(0,255,255,0.15)]">

  <p className="text-xl font-semibold text-white tracking-wide text-center">
    No Results Yet
  </p>
  
  
</div>

        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black/60 backdrop-blur-md shadow-[0_0_80px_rgba(255,255,255,0.05)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/40">
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Rank
                  </th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Name
                  </th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={cn(
                      "border-b border-gray-800/40 transition-colors hover:bg-gray-900/40",
                      entry.rank <= 3 && "bg-cyan-500/5"
                    )}
                  >
                    <td className="px-6 sm:px-8 py-4 sm:py-5">
                      <span className="text-base sm:text-lg font-semibold text-white">
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base text-white">
                      {entry.name}
                    </td>
                    <td className="px-6 sm:px-8 py-4 sm:py-5 text-right">
                      <span
                        className={cn(
                          "text-base sm:text-lg font-semibold",
                          entry.rank <= 3 ? "text-cyan-400" : "text-gray-300"
                        )}
                      >
                        {entry.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
