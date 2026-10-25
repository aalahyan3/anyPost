import { headers } from "next/headers";

// Browsers drop `Secure` cookies on plain http (except localhost), so only mark
// the cookie secure when the request actually came in over https.
// Set COOKIE_SECURE=true/false to override the detection.
export async function shouldUseSecureCookie(): Promise<boolean> {
    const override = process.env.COOKIE_SECURE;
    if (override === "true") return true;
    if (override === "false") return false;

    const proto = (await headers()).get("x-forwarded-proto")?.split(",")[0].trim();
    return proto === "https";
}
