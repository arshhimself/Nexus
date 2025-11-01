import { NextResponse } from "next/server";
import FormData from "form-data";
import fetch from "node-fetch"; // now this works
import { Buffer } from "buffer";

export const runtime = "nodejs"; // ensure Node runtime

export const POST = async (req) => {
  try {
    // Read the incoming file as ArrayBuffer
    const buffer = await req.arrayBuffer();
    const file = Buffer.from(buffer);

    // Create FormData to send to FastAPI
    const form = new FormData();
    form.append("file", file, "or-kuch.webm"); // give the file a name

    const res = await fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/upload/s3/`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Next.js upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
