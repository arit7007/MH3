import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/config";

export async function POST(request: NextRequest) {
  if (hasSupabaseEnv()) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/", request.url));
}
