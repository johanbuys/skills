// Minimal token-refresh client with a deliberate race for the lesson to teach.
let inflight: Promise<string> | null = null;
let token = "expired";

export async function getToken(): Promise<string> {
  if (token !== "expired") return token;
  // BUG the lesson explores: concurrent callers each kick off a refresh.
  inflight = inflight ?? refresh();
  token = await inflight;
  inflight = null;
  return token;
}

async function refresh(): Promise<string> {
  await new Promise((r) => setTimeout(r, 50));
  return "fresh-" + Math.random().toString(36).slice(2, 8);
}
