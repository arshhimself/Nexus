"use client"

import { cn } from "@/lib/utils"
import { LoaderFive } from "@/components/ui/loader";
import { useEffect, useState } from "react"
export default function QuizResultsPage() {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchQuizResults = async () => {
 if (typeof window === "undefined") return; // prevent SSR crash
  const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/quiz/submit/`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch results: ${res.status}`)
      }

      const data = await res.json()
      console.log("Fetched quiz results:", data)
setQuizData(data[0].data)

    } catch (error) {
      console.error("Error fetching quiz results:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizResults()
  }, [])

  const getScoreColor = (score) => {
    if (score >= 9) return "text-cyan-400"
    if (score >= 7) return "text-emerald-400"
    if (score >= 5) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBgColor = (score) => {
    if (score >= 9) return "bg-cyan-500/10"
    if (score >= 7) return "bg-emerald-500/10"
    if (score >= 5) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  // 🌀 Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <LoaderFive text="Generating Result..." />
      </div>
    )
  }


  // if (!quizData) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black text-white">
  //       <p>No quiz data found.</p>
  //     </div>
  //   )
  // }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start bg-black p-5 pt-[20vh]">
      {/* Grid background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />

      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] bg-black" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-neutral-100 mb-2">Quiz Results</h1>
          <p className="text-sm text-neutral-500">Your performance analysis</p>
        </div>

        {/* Average Score Card */}
        <div className="mb-8 rounded-lg border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-8 text-center">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Average Score</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-6xl font-bold text-cyan-400">{quizData.avg_score}</span>
            <span className="text-2xl text-neutral-500">/10</span>
          </div>
          <p className="text-sm text-neutral-400 mt-4">
            {quizData.avg_score >= 8 && "Excellent performance!"}
            {quizData.avg_score >= 6 && quizData.avg_score < 8 && "Good job! Keep improving."}
            {quizData.avg_score < 6 && "Keep practicing to improve your score."}
          </p>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Detailed Results</h2>

          {quizData.questions_answers.map((item, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm p-6 transition-colors hover:bg-neutral-900/50",
                getScoreBgColor(quizData.scores[index]),
              )}
            >
              {/* Question Number and Score */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-400">Q{index + 1}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded",
                      getScoreColor(quizData.scores[index]),
                      "bg-neutral-900/50",
                    )}
                  >
                    {quizData.scores[index]}/10
                  </span>
                </div>
              </div>

              {/* Question */}
              <p className="text-sm text-neutral-100 mb-4 font-medium">{item.q}</p>

              {/* Answer */}
              <div className="mb-4 pl-4 border-l border-neutral-700">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Your Answer</p>
                <p className="text-sm text-neutral-300 font-mono">{item.a}</p>
              </div>

              {/* Feedback */}
              <div className="pl-4 border-l border-neutral-700">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Feedback</p>
                <p className="text-sm text-neutral-400 leading-relaxed">{quizData.feedbacks[index]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
