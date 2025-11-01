// app/api/update-test-status/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Django endpoint
    const djangoUrl = `${process.env.NEXT_PUBLIC_DJANGO_URL}/api/authentication/update-test-status/`;

    const response = await fetch(djangoUrl, {
      method: "GET", // Django side ideally expects GET/PATCH as per your previous code
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: "Failed to update test status", details: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: "Test status updated", data });
  } catch (err) {
    console.error("Error in update-test-status API:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
