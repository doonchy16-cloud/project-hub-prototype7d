import type { Metadata } from "next";
import { PrototypeLoginPage } from "@/components/auth/prototype-login-page";

export const metadata: Metadata = {
  title: "Log In | Prototype 7",
  description: "Temporary prototype login entry for Prototype 7.",
};

export default function LoginPage() {
  return <PrototypeLoginPage />;
}
