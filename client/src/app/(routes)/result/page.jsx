"use client"

import { cn } from "@/lib/utils"

export default function QuizResultsPage() {
  const quizData = {
    questions_answers: [
      {
        q: "You're working on a feature branch halfway through coding. Manager asks you to fix a production bug on main immediately. Your work isn't complete. What do you do?",
        a: "i dont know",
      },
      {
        q: "You accidentally committed and pushed a secret key. How do you remove it?",
        a: "Use `git filter-repo` to remove from history, `git push origin --force`, and regenerate the secret immediately.",
      },
      {
        q: "Wrong commit message but haven't pushed. How to fix?",
        a: "Use `git commit --amend` to edit the message.",
      },
      {
        q: "Multiple small commits for one change. How to merge them before pushing?",
        a: "Use rebase",
      },
      {
        q: "Got merge conflicts after pulling. How to resolve?",
        a: "Run `git status`, manually resolve conflicts in files, `git add <file>`, then `git commit`.",
      },
      {
        q: "Committed to main instead of feature branch. How to move the commit?",
        a: "Create branch: `git branch feature-fix`, switch to main, run `git reset --hard origin/main`.",
      },
      {
        q: "How to see which commit changed which lines in a file?",
        a: "Use `git blame <filename>`.",
      },
      {
        q: "Compare feature branch with main before merging?",
        a: "Run `git diff main..feature-branch`.",
      },
      {
        q: "Teammate force-pushed main. Your local main is out of sync. What to do?",
        a: "Run `git fetch origin`, then `git reset --hard origin/main`.",
      },
      {
        q: "Steps to contribute to an open-source project on GitHub?",
        a: "Fork repo, clone locally, create branch, make changes, push branch, create Pull Request.",
      },
    ],
    feedbacks: [
      "The answer is not helpful at all. It does not provide any strategy or solution for addressing the situation where the developer needs to fix a production bug while working on a feature branch. Simply saying 'I don't know' does not address the question.",
      "The answer correctly identifies the use of `git filter-repo` to remove sensitive data from the Git history. It also recommends the appropriate action to force push to the repository to overwrite the history. Furthermore, suggesting to regenerate the secret is a good practice when a secret has been exposed. Overall, the solution is accurate and provides good instructions for handling the situation effectively.",
      "The answer is correct as it provides the appropriate command to amend a commit message before pushing. The command `git commit --amend` allows users to modify the last commit message without creating a new commit.",
      "The answer is partially correct. Using 'rebase' can help squash multiple commits into one before pushing, but it might not be the clearest terminology or method for a beginner. It would have been better to mention 'git rebase -i' for interactive rebasing or provide a bit more context about squashing commits. Overall, it lacks some depth and clarity regarding the process, but it does provide a correct concept.",
      "The answer is correct. It accurately describes the process of resolving merge conflicts after a pull. The steps outlined are appropriate: first checking the status to identify conflicted files, manually resolving them, staging the resolved files with `git add`, and then committing the changes. However, the answer could be improved by mentioning the use of a merge tool or the `git mergetool` command for resolving conflicts in a more user-friendly way, as well as providing further instructions on what to do in case of more complex scenarios. Overall, it's a good but somewhat basic response.",
      "The answer is partially correct but incomplete. The steps provided do not fully resolve the issue of moving a commit from the main branch to a feature branch. The correct approach should involve using `git cherry-pick` to move the specific commit to the feature branch after creating it or using `git reset` with a specific commit reference rather than `origin/main`. Furthermore, running `git reset --hard` can result in the loss of the committed changes on the main branch, which could lead to data loss. It lacks clarity on how to handle the moving process and is misleading.",
      "The answer is correct. `git blame <filename>` shows the author of each line along with the commit hash that changed that line, which is exactly what the question is asking. However, it lacks additional context about how to use the command or any alternative methods like `git log -p <filename>` or `git diff <commit>^ <commit> -- <filename>` for more detailed revisions. Therefore, while correct, the answer could be more informative.",
      "The answer is correct; it accurately specifies the command needed to compare the differences between the main branch and the feature branch before merging. The use of `git diff` is appropriate for showing changes. However, it could be improved by specifying whether the context is that you should be on the main branch or the feature branch when running the command, but this isn't strictly necessary. Overall, it's a good answer.",
      "The answer is correct; however, it does not mention that running `git reset --hard` will discard any local changes on the main branch. It should also include a warning to make sure local changes are saved or committed elsewhere before performing this command.",
      "The provided answer accurately outlines the essential steps needed to contribute to an open-source project on GitHub. It mentions forking the repository, cloning it locally, creating a new branch for changes, pushing the branch to the repository, and finally creating a pull request – all of which are crucial steps in the contribution process. Therefore, this answer is concise and correct.",
    ],
    scores: [0, 10, 10, 6, 8, 4, 8, 8, 9, 10],
    avg_score: 7.3,
  }

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
