import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_URL is not configured." },
      { status: 500 }
    );
  }

  try {
    const target = `${backendUrl}/test`;
    const incomingCookie = request.headers.get("cookie") || "";

    const response = await fetch(target, {
      method: "GET",
      cache: "no-store",
      headers: {
        cookie: incomingCookie,
      },
    });

    const rawText = await response.text();
    let parsedBody: unknown = rawText;

    try {
      parsedBody = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsedBody = rawText;
    }

    return NextResponse.json({
      requestUrl: target,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: parsedBody,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to reach backend /test endpoint.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
