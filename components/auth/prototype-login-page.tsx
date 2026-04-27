"use client";

import { ArrowRight, Globe, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { InfoCard } from "@/components/common/info-card";
import { ThemeButton } from "@/components/common/theme-controls";
import { marketingTheme } from "@/lib/marketing-theme";

function goToSignup() {
  if (typeof window === "undefined") return;

  window.localStorage.setItem("prototype7:appStage", JSON.stringify("signin_profile"));
  window.localStorage.setItem("prototype7:welcomeIntent", JSON.stringify("signup"));
  window.location.assign("/app");
}

export function PrototypeLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      window.localStorage.setItem("prototype7:appStage", JSON.stringify("app"));
      window.localStorage.setItem("prototype7:email", JSON.stringify(email.trim()));
      window.location.assign("/app");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: marketingTheme.appBg, color: marketingTheme.text }}>
      <header className="border-b" style={{ borderColor: marketingTheme.border, backgroundColor: "rgba(248,250,252,0.92)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
          <a href="/welcome" className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: marketingTheme.primary, color: marketingTheme.primaryText }}>
              <Globe className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-semibold tracking-[0.18em] uppercase">Prototype 7D</span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeButton themeStyles={marketingTheme} onClick={() => window.location.assign("/welcome")}>
              Welcome
            </ThemeButton>
            <button type="button" onClick={goToSignup} className="rounded-2xl px-4 py-2.5 text-sm font-semibold" style={{ backgroundColor: marketingTheme.primary, color: marketingTheme.primaryText }}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-8 px-4 py-10 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ backgroundColor: marketingTheme.pill, color: marketingTheme.primary }}>
            <Sparkles className="h-4 w-4" />
            MongoDB-backed access
          </div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Log in and continue building your community map.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8" style={{ color: marketingTheme.muted }}>
            Prototype 7D adds MongoDB-backed accounts, profiles, projects, memberships, favorites, questionnaire persistence, and chat collections.
          </p>
        </div>

        <InfoCard themeStyles={marketingTheme} className="p-6 md:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: marketingTheme.text }}>
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ backgroundColor: marketingTheme.panel, borderColor: marketingTheme.border }}>
                <Mail className="h-4 w-4 shrink-0" style={{ color: marketingTheme.muted }} />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  style={{ color: marketingTheme.text }}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" style={{ color: marketingTheme.text }}>
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ backgroundColor: marketingTheme.panel, borderColor: marketingTheme.border }}>
                <LockKeyhole className="h-4 w-4 shrink-0" style={{ color: marketingTheme.muted }} />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  style={{ color: marketingTheme.text }}
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "#fecaca", backgroundColor: "#fff1f2", color: "#b91c1c" }}>
                {error}
              </div>
            ) : null}

            <button disabled={loading} type="submit" className="w-full rounded-2xl px-5 py-3 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: marketingTheme.primary, color: marketingTheme.primaryText }}>
              {loading ? "Logging In..." : "Continue to App"}
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl border p-4 text-sm leading-7" style={{ borderColor: marketingTheme.border, backgroundColor: marketingTheme.panel, color: marketingTheme.muted }}>
            If MongoDB Atlas is not configured, login will fail clearly and the API will tell you which environment variable is missing.
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span style={{ color: marketingTheme.muted }}>Need a new profile?</span>
            <button type="button" onClick={goToSignup} className="font-semibold" style={{ color: marketingTheme.primary }}>
              Sign Up
            </button>
          </div>
        </InfoCard>
      </section>
    </main>
  );
}
