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
    <header className="sticky top-0 z-20 border-b border-brand-100/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-xs font-extrabold text-white shadow-sm transition-shadow group-hover:shadow-glow"
          >
            DL
          </span>
          <span className="text-lg font-extrabold text-brand-900 tracking-tight">
            Dignity<span className="text-brand-600">Link</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold sm:gap-2">
          <Link
            href="/intake"
            className="rounded-lg px-3 py-1.5 text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            Get help
          </Link>
          {workerEmail ? (
            <>
              <Link
                href="/outreach"
                className="rounded-lg px-3 py-1.5 text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
              >
                Outreach
              </Link>
              <Link
                href="/admin"
                className="rounded-lg px-3 py-1.5 text-brand-700 transition-colors hover:bg-brand-50 hover:text-brand-900"
              >
                Admin
              </Link>
              <form action="/auth/signout" method="post">
                <button className="rounded-lg px-3 py-1.5 text-brand-600 transition-colors hover:bg-brand-50">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1 rounded-xl border border-brand-200 bg-white px-4 py-1.5 text-brand-700 shadow-sm transition-all hover:border-brand-300 hover:bg-brand-50"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
