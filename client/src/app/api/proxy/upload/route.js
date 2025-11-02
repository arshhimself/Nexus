export const runtime = "nodejs"; // ensures Next.js runs this in Node, not Edge

export async function POST(req) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_FASTAPI_URL}/upload/s3/`;

    // directly stream incoming request to backend
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") || "application/octet-stream",
      },
      body: req.body, // stream — no buffering
    });

    // forward backend's response as-is
    const text = await res.text(); // or res.json() if always JSON
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("Streaming proxy error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
