"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/outreach";
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const title = useMemo(
    () => (mode === "login" ? "Log in to Harbor" : "Create an outreach account"),
    [mode]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push(next);
        router.refresh();
        return;
      }

      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        next
      )}`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName,
            role: "outreach_worker",
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        router.push(next);
        router.refresh();
        return;
      }

      setMessage("Check your email to confirm your account, then come back to log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-brand-900">{title}</h1>
        <p className="text-base text-brand-700">
          Worker tools are restricted to verified outreach staff and partner admins.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-2 rounded-xl border border-brand-100 bg-brand-50 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-base font-semibold ${
              mode === "login" ? "bg-white text-brand-800 shadow-sm" : "text-brand-600"
            }`}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-base font-semibold ${
              mode === "signup" ? "bg-white text-brand-800 shadow-sm" : "text-brand-600"
            }`}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="block space-y-1 text-base font-medium text-brand-800">
              <span>Full name</span>
              <input
                className="w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label className="block space-y-1 text-base font-medium text-brand-800">
            <span>Email</span>
            <input
              className="w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="block space-y-1 text-base font-medium text-brand-800">
            <span>Password</span>
            <input
              className="w-full rounded-xl border border-brand-200 px-3 py-2 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-base text-red-700">{error}</p>}
          {message && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-base text-emerald-800">
              {message}
            </p>
          )}

          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
