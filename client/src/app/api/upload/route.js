// import { NextResponse } from "next/server";

// export const runtime = "nodejs";

// export const POST = async (req) => {
//   try {
//     const buffer = await req.arrayBuffer();
//     const file = new Blob([buffer], { type: "video/webm" });

//     const form = new FormData();
//     form.append("file", file, "or-kuch.webm");

//     const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/api/upload/s3/`, {
//       method: "POST",
//       body: form,
//     });

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });
//   } catch (err) {
//     console.error("Next.js upload error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// };
export async function POST(request) {
  try {
    // Read incoming form data (file + optional s3_file_name)
    const formData = await request.formData();

    // Django/FastAPI backend base URL
    const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL; // change if needed

    // Send to backend upload route
    const res = await fetch(`${backendUrl}/upload/s3/`, {
      method: "POST",
      body: formData, // directly pass the FormData
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("S3 Upload API Error:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
