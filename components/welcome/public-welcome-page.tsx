"use client";

import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FolderKanban,
  Globe,
  Heart,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { InfoCard } from "@/components/common/info-card";
import { ThemeButton } from "@/components/common/theme-controls";
import { marketingTheme as welcomeTheme } from "@/lib/marketing-theme";
import { sharedProjectsSeed } from "@/lib/seed-data";
import type { AppStage, SharedProject } from "@/types/prototype";

const benefits = [
  {
    title: "Find aligned people",
    description: "Build around shared values, compatible lifestyles, practical availability, and real community skills.",
    icon: Users,
  },
  {
    title: "Coordinate real projects",
    description: "Explore community visions, project needs, member roles, resources, and funding paths in one place.",
    icon: FolderKanban,
  },
  {
    title: "Map opportunity carefully",
    description: "Use location as a coordination signal without exposing precise public details before trust is earned.",
    icon: Compass,
  },
  {
    title: "Move from interest to action",
    description: "Turn browsing into next steps through project rooms, matching foundations, support, and planning tools.",
    icon: CheckCircle2,
  },
];

const steps = [
  "Create a rich profile around your skills, values, goals, location range, and availability.",
  "Explore public community projects and identify the type of work you want to join or start.",
  "Use matching, chats, and project rooms to coordinate with people who fit the mission.",
  "Grow projects with resources, funding plans, support paths, and community readiness signals.",
];

const faqs = [
  {
    question: "Is this only a social network?",
    answer:
      "No. The app is designed as a coordination platform for people, projects, resources, and community formation.",
  },
  {
    question: "Are public project locations exact?",
    answer:
      "No. The welcome page intentionally shows broad regions only. Exact coordination belongs inside trusted project workflows.",
  },
  {
    question: "Do visitors see personalized recommendations?",
    answer:
      "No. Public visitors see general previews. Personalized matching starts after entering the app and completing profile context.",
  },
  {
    question: "Can a project ask for specific skills?",
    answer:
      "Yes. Projects can describe needed skills, member types, resources, funding needs, and community style.",
  },
];

function readStoredAppStage(): AppStage | null {
  if (typeof window === "undefined") return null;

  const storedStage = window.localStorage.getItem("prototype7:appStage");
  if (!storedStage) return null;

  try {
    const parsed = JSON.parse(storedStage);
    return typeof parsed === "string" ? (parsed as AppStage) : null;
  } catch {
    return storedStage as AppStage;
  }
}

function generalizeLocation(project: SharedProject) {
  if (project.state && project.country) return `${project.state} region`;
  if (project.country) return `${project.country} region`;
  return `${project.continent} region`;
}

function enterApp(intent: "login" | "signup" | "open") {
  if (typeof window === "undefined") return;

  if (intent === "login") {
    window.location.assign("/login");
    return;
  }

  if (intent !== "open") {
    window.localStorage.setItem("prototype7:appStage", JSON.stringify("signin_profile"));
    window.localStorage.setItem("prototype7:welcomeIntent", JSON.stringify(intent));
  }

  window.location.assign("/app");
}

export function PublicWelcomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const projectPreviews = useMemo(() => sharedProjectsSeed.slice(0, 4), []);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsSignedIn(readStoredAppStage() === "app");
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: welcomeTheme.appBg, color: welcomeTheme.text }}>
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ borderColor: welcomeTheme.border, backgroundColor: "rgba(248,250,252,0.88)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <a href="#top" className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: welcomeTheme.primary, color: welcomeTheme.primaryText }}>
              <Globe className="h-5 w-5" />
            </span>
            <span className="truncate text-sm font-semibold tracking-[0.18em] uppercase">Prototype 7</span>
          </a>

          <nav className="hidden items-center gap-5 text-sm font-medium md:flex" style={{ color: welcomeTheme.muted }}>
            <a href="#mission">Mission</a>
            <a href="#benefits">Benefits</a>
            <a href="#projects">Projects</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {isSignedIn ? (
              <button type="button" onClick={() => enterApp("open")} className="rounded-2xl px-4 py-2 text-sm font-semibold" style={{ backgroundColor: welcomeTheme.primary, color: welcomeTheme.primaryText }}>
                Open App
              </button>
            ) : (
              <>
                <button type="button" onClick={() => enterApp("login")} className="rounded-2xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: welcomeTheme.border, color: welcomeTheme.text, backgroundColor: welcomeTheme.card }}>
                  Log In
                </button>
                <button type="button" onClick={() => enterApp("signup")} className="rounded-2xl px-3 py-2 text-sm font-semibold" style={{ backgroundColor: welcomeTheme.primary, color: welcomeTheme.primaryText }}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section
        id="top"
        className="relative min-h-[78vh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(6, 18, 15, 0.82), rgba(6, 18, 15, 0.44), rgba(6, 18, 15, 0.2)), url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80")',
        }}
      >
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-16 md:px-6">
          <div className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Community formation platform
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Find aligned people and build sustainable off-grid communities.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/86 md:text-lg">
              Prototype 7 connects people, projects, skills, resources, and funding paths so real-world community visions can become coordinated plans.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => enterApp(isSignedIn ? "open" : "signup")} className="rounded-2xl px-5 py-3 text-sm font-semibold" style={{ backgroundColor: "#f8fafc", color: "#14532d" }}>
                {isSignedIn ? "Open App" : "Start Building"}
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </button>
              <a href="#projects" className="rounded-2xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
                Browse Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: welcomeTheme.primary }}>Mission</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              A practical bridge between shared values and real coordination.
            </h2>
          </div>
          <p className="text-base leading-8" style={{ color: welcomeTheme.muted }}>
            The app is built for people who want more than browsing. It helps communities understand who is ready, which skills are missing, what projects need, and what steps can move a group toward land, resources, governance, funding, and daily life.
          </p>
        </div>
      </section>

      <section id="benefits" className="border-y py-16" style={{ borderColor: welcomeTheme.border, backgroundColor: "#eef6f0" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: welcomeTheme.primary }}>Benefits</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Designed for people, projects, and viable communities.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <InfoCard key={benefit.title} themeStyles={welcomeTheme} className="p-5">
                  <Icon className="h-7 w-7" style={{ color: welcomeTheme.primary }} />
                  <h3 className="mt-5 text-lg font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7" style={{ color: welcomeTheme.muted }}>{benefit.description}</p>
                </InfoCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: welcomeTheme.primary }}>How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">From profile to project coordination.</h2>
          <p className="mt-4 text-sm leading-7" style={{ color: welcomeTheme.muted }}>
            The full app turns profile context into project discovery, chat access, project rooms, and readiness signals.
          </p>
        </div>
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-2xl border p-4" style={{ backgroundColor: welcomeTheme.card, borderColor: welcomeTheme.border }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold" style={{ backgroundColor: welcomeTheme.pill, color: welcomeTheme.primary }}>
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-7" style={{ color: welcomeTheme.muted }}>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="border-y py-16" style={{ borderColor: welcomeTheme.border, backgroundColor: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: welcomeTheme.primary }}>Public previews</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Browse general project directions.</h2>
              <p className="mt-4 text-sm leading-7" style={{ color: welcomeTheme.muted }}>
                These are public, non-personalized examples. Locations are intentionally generalized.
              </p>
            </div>
            <ThemeButton themeStyles={welcomeTheme} onClick={() => enterApp(isSignedIn ? "open" : "signup")}>
              {isSignedIn ? "Open App" : "Join to see more"}
            </ThemeButton>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {projectPreviews.map((project) => (
              <InfoCard key={project.id} themeStyles={welcomeTheme} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: welcomeTheme.pill, color: welcomeTheme.primary }}>
                      {project.category}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm font-medium" style={{ color: welcomeTheme.muted }}>
                      {generalizeLocation(project)}
                    </p>
                  </div>
                  <Heart className="h-5 w-5 shrink-0" style={{ color: welcomeTheme.primary }} />
                </div>
                <p className="mt-4 text-sm leading-7" style={{ color: welcomeTheme.muted }}>{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border px-2.5 py-1 text-xs" style={{ borderColor: welcomeTheme.border, color: welcomeTheme.text }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </InfoCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard themeStyles={welcomeTheme} className="p-6">
            <ShieldCheck className="h-7 w-7" style={{ color: welcomeTheme.primary }} />
            <h3 className="mt-4 text-lg font-semibold">Trust before precision</h3>
            <p className="mt-3 text-sm leading-7" style={{ color: welcomeTheme.muted }}>Public previews stay broad. Specific coordination belongs inside member and project workflows.</p>
          </InfoCard>
          <InfoCard themeStyles={welcomeTheme} className="p-6">
            <MessageSquare className="h-7 w-7" style={{ color: welcomeTheme.primary }} />
            <h3 className="mt-4 text-lg font-semibold">Chats with purpose</h3>
            <p className="mt-3 text-sm leading-7" style={{ color: welcomeTheme.muted }}>Project rooms, direct messages, and AI support are designed around practical next steps.</p>
          </InfoCard>
          <InfoCard themeStyles={welcomeTheme} className="p-6">
            <Globe className="h-7 w-7" style={{ color: welcomeTheme.primary }} />
            <h3 className="mt-4 text-lg font-semibold">Built for ecosystems</h3>
            <p className="mt-3 text-sm leading-7" style={{ color: welcomeTheme.muted }}>Resources, services, funding, and support layers can grow around the core matching platform.</p>
          </InfoCard>
        </div>
      </section>

      <section id="faq" className="border-t py-16" style={{ borderColor: welcomeTheme.border }}>
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: welcomeTheme.primary }}>FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Questions before entering the app.</h2>
          </div>
          <div className="mt-8 grid gap-3">
            {faqs.map((faq) => (
              <InfoCard key={faq.question} themeStyles={welcomeTheme} className="p-5">
                <h3 className="text-base font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: welcomeTheme.muted }}>{faq.answer}</p>
              </InfoCard>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-8 md:px-6" style={{ borderColor: welcomeTheme.border, backgroundColor: "#0f172a", color: "#e2e8f0" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">Prototype 7</p>
            <p className="mt-1 text-sm text-slate-400">Community matching, project coordination, and off-grid readiness.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <a href="#mission">Mission</a>
            <a href="#projects">Projects</a>
            <a href="#faq">FAQ</a>
            <button type="button" onClick={() => enterApp(isSignedIn ? "open" : "signup")}>
              {isSignedIn ? "Open App" : "Sign Up"}
            </button>
          </div>
          <p className="text-sm text-slate-400">(c) {currentYear} Prototype 7</p>
        </div>
      </footer>
    </main>
  );
}
