import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/analyze:", err);
    return NextResponse.json({ error: "Failed to analyze data" }, { status: 500 });
  }
}
