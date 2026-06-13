import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  if (!hasSupabaseEnv()) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-3xl font-extrabold text-brand-900">Supabase setup needed</h1>
        <div className="card space-y-3 text-brand-700">
          <p>
            Add your Supabase project URL and publishable key to `.env.local` before
            outreach workers can create accounts or log in.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
            NEXT_PUBLIC_SUPABASE_URL=your_project_url{"\n"}
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
          </pre>
        </div>
      </div>
    );
  }

  const supabase = createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect(searchParams.next || "/outreach");
  }

  return <AuthForm />;
}
