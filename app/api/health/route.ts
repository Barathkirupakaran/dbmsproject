import { NextResponse } from "next/server";

import { dbAll, getDbMode } from "@/lib/db";

export async function GET() {
  const hasDbUrl = Boolean(process.env.TURSO_DATABASE_URL);
  const hasAuthToken = Boolean(process.env.TURSO_AUTH_TOKEN);
  const dbMode = getDbMode();

  try {
    await dbAll("SELECT 1 AS ok");

    return NextResponse.json({
      ok: true,
      dbConnected: true,
      dbMode,
      hasDbUrl,
      hasAuthToken,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database health check failed";
    return NextResponse.json(
      {
        ok: false,
        dbConnected: false,
        dbMode,
        hasDbUrl,
        hasAuthToken,
        error: message,
        checkedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
