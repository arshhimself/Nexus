// src/app/api/upload/route.js
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.formData();

    const file = body.get("file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.FASTAPI_URL}/upload/s3/`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
