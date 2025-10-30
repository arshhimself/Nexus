"use client"

import { cn } from "@/lib/utils"

export default function LeaderboardPage() {
  const mockData = [
    { rank: 1, name: "Alex Chen", time: "2:34", points: 9.8 },
    { rank: 2, name: "Jordan Smith", time: "2:45", points: 9.5 },
    { rank: 3, name: "Casey Lee", time: "2:52", points: 9.2 },
    { rank: 4, name: "Morgan Davis", time: "3:01", points: 8.9 },
    { rank: 5, name: "Taylor Brown", time: "3:15", points: 8.6 },
    { rank: 6, name: "Riley Wilson", time: "3:28", points: 8.3 },
    { rank: 7, name: "Jamie Martinez", time: "3:42", points: 8.0 },
    { rank: 8, name: "Sam Johnson", time: "3:55", points: 7.7 },
  ]

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

        {/* Table */}
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
                {/* Hide Time column on mobile */}
                <th className="hidden sm:table-cell px-6 sm:px-8 py-4 sm:py-5 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Time
                </th>
                <th className="px-6 sm:px-8 py-4 sm:py-5 text-right text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((entry) => (
                <tr
                  key={entry.rank}
                  className={cn(
                    "border-b border-gray-800/40 transition-colors hover:bg-gray-900/40",
                    entry.rank <= 3 && "bg-cyan-500/5"
                  )}
                >
                  <td className="px-6 sm:px-8 py-4 sm:py-5">
                    <span className="text-base sm:text-lg font-semibold text-white">#{entry.rank}</span>
                  </td>
                  <td className="px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base text-white">
                    {entry.name}
                  </td>
                  {/* Hide Time column on mobile */}
                  <td className="hidden sm:table-cell px-6 sm:px-8 py-4 sm:py-5 font-mono text-gray-300 text-sm">
                    {entry.time}
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
      </div>
    </div>
  )
}
