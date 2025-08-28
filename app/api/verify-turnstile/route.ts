import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const secret = "1x0000000000000000000000000000000AA"; // 只放后端
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
      }
    );

    const data = await r.json();

    return NextResponse.json(
      { success: !!data?.success, data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Verify Error" },
      { status: 500 }
    );
  }
}
