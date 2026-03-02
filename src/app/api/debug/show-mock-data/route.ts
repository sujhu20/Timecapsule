import { NextRequest, NextResponse } from "next/server";
import { productionGuard } from "@/lib/production-guard";

export async function GET(req: NextRequest) {
  const guard = productionGuard();
  if (guard) return guard;

  return NextResponse.json({
    success: true,
    message: "mock-db has been removed. This endpoint is a no-op.",
    timestamp: new Date().toISOString(),
  });
}