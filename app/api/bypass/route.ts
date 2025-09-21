import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createSign } from "crypto";

type Claims = {
  ua: string;
  src_ip: string;
  iat: number;
  exp: number;
};

const FIVE_MINUTES = 5 * 60;

const getPrimaryIp = (headerValue?: string | null) => {
  if (!headerValue) return "";
  return headerValue.split(",")[0]?.trim() ?? "";
};

const signClaims = (claims: Claims) => {
  const privateKey = process.env.AUTH_BYPASS_PRIVATE_KEY;
  const keyId = process.env.AUTH_BYPASS_KEY_ID;
  if (!privateKey || !keyId) {
    return null;
  }

  const encode = (input: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(input)).toString("base64url");
  const header = encode({ alg: "RS256", typ: "JWT", kid: keyId });
  const payload = encode(claims);
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  signer.end();
  const signature = signer.sign(privateKey, "base64url");
  return `${header}.${payload}.${signature}`;
};

export async function GET() {
  const headerList = await headers();
  const country = headerList.get("x-vercel-ip-country")?.toUpperCase() ?? "";
  const userAgent = headerList.get("user-agent") ?? "";
  const countryEligible = country === "CN";
  const uaEligible = /MicroMessenger/i.test(userAgent);
  const eligible = countryEligible || uaEligible;

  if (!eligible) {
    return NextResponse.json({ eligible: false }, { status: 200 });
  }

  const srcIp =
    getPrimaryIp(headerList.get("x-real-ip")) ||
    getPrimaryIp(headerList.get("x-forwarded-for")) ||
    getPrimaryIp(headerList.get("x-vercel-forwarded-for")) ||
    (headerList.get("x-vercel-ip") ?? "");

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + FIVE_MINUTES;
  const claims: Claims = {
    ua: userAgent,
    src_ip: srcIp,
    iat,
    exp,
  };

  const token = signClaims(claims);
  if (!token) {
    return NextResponse.json(
      {
        eligible: true,
        forwarded: false,
        error: "missing_rs256_keys",
      },
      { status: 500 }
    );
  }

  const apiBase = process.env.NEXT_PUBLIC_FXRATE_API;
  if (!apiBase) {
    return NextResponse.json(
      {
        eligible: true,
        forwarded: false,
        error: "missing_api_base",
      },
      { status: 500 }
    );
  }

  const backendUrl = new URL("/api/signed", apiBase);
  backendUrl.searchParams.set("token", token);

  try {
    const backendResponse = await fetch(backendUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token, ...claims }),
      cache: "no-store",
    });

    const status = backendResponse.status;
    let backendError: string | undefined;
    if (!backendResponse.ok) {
      try {
        const data = await backendResponse.json();
        backendError = data?.error || backendResponse.statusText;
      } catch (_) {
        backendError = backendResponse.statusText;
      }
    }

    const payload = {
      eligible: true,
      forwarded: backendResponse.ok,
      backendStatus: status,
      backendError,
      countryEligible,
      uaEligible,
    };

    const responseJson = NextResponse.json(payload, {
      status: backendResponse.ok ? 200 : 502,
    });

    if (backendResponse.ok) {
      const setCookieCandidates: string[] = [];
      if (typeof (backendResponse.headers as any).getSetCookie === "function") {
        const list = (backendResponse.headers as any).getSetCookie();
        if (Array.isArray(list)) {
          setCookieCandidates.push(...list);
        }
      }
      const combined = backendResponse.headers.get("set-cookie");
      if (combined) {
        const pieces = combined.match(/(?:[^,]|,(?=\s*[^=\s]+=))+/g);
        if (pieces) {
          setCookieCandidates.push(...pieces.map((item) => item.trim()).filter(Boolean));
        }
      }

      for (const cookie of setCookieCandidates) {
        responseJson.headers.append("set-cookie", cookie);
      }
    }

    return responseJson;
  } catch (error) {
    return NextResponse.json(
      {
        eligible: true,
        forwarded: false,
        error: "backend_unreachable",
      },
      {
        status: 502,
      }
    );
  }
}
