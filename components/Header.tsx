import Link from "next/link";
import Image from "next/image";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function Header() {
  let workerEmail: string | undefined;

  if (hasSupabaseEnv()) {
    const supabase = createClient();
    const { data } = await supabase.auth.getClaims();
    workerEmail =
      typeof data?.claims.email === "string" ? data.claims.email : undefined;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-brand-200/70 bg-brand-50/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/harbor-logo.png"
            alt="Harbor"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {workerEmail && (
            <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-widest text-brand-700 sm:flex">
              <Link href="/outreach" className="transition-colors hover:text-brand-500">
                Outreach
              </Link>
              <Link href="/admin" className="transition-colors hover:text-brand-500">
                Admin
              </Link>
            </nav>
          )}

          {workerEmail ? (
            <form action="/auth/signout" method="post">
              <button className="text-sm font-semibold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">
                Sign out
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold uppercase tracking-widest text-brand-700 hover:text-brand-500 transition-colors sm:inline"
              >
                Worker Log in
              </Link>
              <Link href="/intake" className="btn-primary py-2.5 px-5 text-sm">
                Get Help
              </Link>
            </>
          )}

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
