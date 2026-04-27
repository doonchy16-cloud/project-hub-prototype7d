import type { Metadata } from "next";
import { PublicWelcomePage } from "@/components/welcome/public-welcome-page";

export const metadata: Metadata = {
  title: "Welcome | Prototype 7",
  description: "A public welcome page for the off-grid community coordination platform.",
};

export default function WelcomePage() {
  return <PublicWelcomePage />;
}
