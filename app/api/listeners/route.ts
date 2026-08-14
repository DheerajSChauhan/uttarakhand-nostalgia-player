import { NextResponse } from "next/server";

// In-memory active presence store
// Key: visitorId, Value: timestamp of last ping
const activeSessions = new Map<string, number>();

// Clean up sessions inactive for more than 25 seconds
function cleanupStaleSessions() {
  const cutoff = Date.now() - 25000;
  for (const [id, lastSeen] of activeSessions.entries()) {
    if (lastSeen < cutoff) {
      activeSessions.delete(id);
    }
  }
}

export async function GET() {
  cleanupStaleSessions();
  const count = Math.max(1, activeSessions.size);
  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, action } = body;

    if (visitorId && typeof visitorId === "string") {
      if (action === "leave") {
        activeSessions.delete(visitorId);
      } else {
        activeSessions.set(visitorId, Date.now());
      }
    }

    cleanupStaleSessions();
    const count = Math.max(1, activeSessions.size);

    return NextResponse.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch {
    cleanupStaleSessions();
    return NextResponse.json({ count: Math.max(1, activeSessions.size) });
  }
}
