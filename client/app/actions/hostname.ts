"use server"

// Public base URL used in integration snippets, e.g. "anypost.com" or "http://1.2.3.4:8080".
// Read at runtime so it can change without rebuilding the image. Returns null when unset.
export async function getPublicHostname(): Promise<string | null> {
    const value = process.env.APP_HOSTNAME?.trim();
    if (!value) return null;

    const withScheme = /^https?:\/\//.test(value) ? value : `https://${value}`;
    return withScheme.replace(/\/+$/, "");
}
