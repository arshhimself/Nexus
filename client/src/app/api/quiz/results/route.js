export async function GET(request) {
    try {
      // Backend URL from env
      const backendUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
  
      const res = await fetch(`${backendUrl}/api/quiz/results/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch quiz results");
      }
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Leaderboard API Error:", error);
  
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  