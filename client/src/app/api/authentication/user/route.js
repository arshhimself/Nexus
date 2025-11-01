export async function GET(request) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
  
      // Read token from frontend
      const token = request.headers.get("authorization");
  
      const res = await fetch(`${backendUrl}/api/authentication/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch user data: ${res.status}`);
      }
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("User API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  