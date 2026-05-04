import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passSchema = z.string().min(6, "At least 6 characters").max(72);
const nameSchema = z.string().trim().min(1, "Name required").max(100);

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = `${mode === "login" ? "Sign In" : "Create Account"} — ANITROH STORE`;
    if (user) navigate("/account", { replace: true });
  }, [user, mode, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      passSchema.parse(password);
      if (mode === "signup") nameSchema.parse(name);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message ?? "Invalid input");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: name },
        },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created. Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("Welcome back."); navigate("/account"); }
    }
    setBusy(false);
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); setBusy(false); return; }
    if (result.redirected) return;
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-edit py-16 md:py-24 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="eyebrow mb-4">{mode === "login" ? "Welcome back" : "Join the house"}</div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h1>
          </div>

          <button
            onClick={google}
            disabled={busy}
            className="w-full border border-border py-3.5 text-[12px] tracking-[0.2em] uppercase hover:bg-secondary transition-colors mb-6 flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required maxLength={100}
                className="w-full border border-border px-4 py-3.5 bg-transparent text-sm focus:border-gold outline-none" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required maxLength={255}
              className="w-full border border-border px-4 py-3.5 bg-transparent text-sm focus:border-gold outline-none" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required maxLength={72}
              className="w-full border border-border px-4 py-3.5 bg-transparent text-sm focus:border-gold outline-none" />
            <button type="submit" disabled={busy}
              className="w-full bg-primary text-primary-foreground py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-gold hover:text-primary transition-colors disabled:opacity-50">
              {busy ? "Please wait…" : (mode === "login" ? "Sign In" : "Create Account")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {mode === "login" ? "New to ANITROH?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-foreground underline-grow">
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/" className="hover:text-foreground">← Back to store</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
