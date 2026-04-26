import { NextResponse } from "next/server";

import { ENTITY_LIST } from "@/lib/schema";

export async function GET() {
  return NextResponse.json({ entities: ENTITY_LIST });
}
