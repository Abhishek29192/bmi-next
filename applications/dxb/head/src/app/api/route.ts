import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  revalidateTag(id);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
