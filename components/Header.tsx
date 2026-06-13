import Link from "next/link";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  let workerEmail: string | undefined;

  if (hasSupabaseEnv()) {
    const supabase = createClient();
    const { data } = await supabase.auth.getClaims();
    workerEmail =
      typeof data?.claims.email === "string" ? data.claims.email : undefined;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white"
          >
            D
          </span>
          <span className="text-lg font-bold text-brand-800">DignityLink</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-brand-700 sm:gap-3">
          <Link href="/intake" className="rounded-lg px-2 py-1 hover:bg-brand-50 sm:px-3">
            Get help
          </Link>
          {workerEmail ? (
            <>
              <Link href="/outreach" className="rounded-lg px-2 py-1 hover:bg-brand-50 sm:px-3">
                Outreach
              </Link>
              <Link href="/admin" className="rounded-lg px-2 py-1 hover:bg-brand-50 sm:px-3">
                Admin
              </Link>
              <form action="/auth/signout" method="post">
                <button className="rounded-lg px-2 py-1 text-brand-700 hover:bg-brand-50 sm:px-3">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-lg px-2 py-1 hover:bg-brand-50 sm:px-3">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
