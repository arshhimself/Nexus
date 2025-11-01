import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const token = req.headers.get("authorization");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_URL}/api/quiz/submit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/quiz-submit:", err);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}


export async function GET(request) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
  
      // Read token from headers sent by frontend
      const token = request.headers.get("authorization");
  
      const res = await fetch(`${backendUrl}/api/quiz/submit/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch quiz results: ${res.status}`);
      }
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Quiz Submit API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
