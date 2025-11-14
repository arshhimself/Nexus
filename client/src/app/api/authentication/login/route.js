export async function POST(request) {
    try {
      const body = await request.json();
  
      // Backend URL from env
      const backendUrl = process.env.NEXT_PUBLIC_DJANGO_URL;
  
      const res = await fetch(`${backendUrl}/api/authentication/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
  
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Login API Error:", error);
  
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  