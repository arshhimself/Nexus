import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/quiz/results/`);
    if (!res.ok) throw new Error("Failed to fetch results");

    const result = await res.json();

    // Sort by avg_score descending
    const sorted = result
      .filter((item) => item.avg_score !== null)
      .sort((a, b) => b.avg_score - a.avg_score)
      .map((item, index) => ({
        rank: index + 1,
        name: item.user,
        points: item.avg_score.toFixed(2),
      }));

    return NextResponse.json(sorted);
  } catch (err) {
    console.error("Error in /api/leaderboard:", err);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
