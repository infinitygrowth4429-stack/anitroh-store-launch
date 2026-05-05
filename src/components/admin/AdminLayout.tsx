import { ReactNode } from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Tag, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/context/AuthContext";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/alerts", label: "Low Stock", icon: AlertTriangle },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const { pathname } = useLocation();

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-serif text-3xl">Admin access required</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Your account doesn't have admin privileges. Contact the store owner to be granted access.
        </p>
        <NavLink to="/" className="text-[11px] tracking-[0.22em] uppercase underline-grow">Return home</NavLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <img src={anitrohLogo} alt="Anitroh" className="h-10 w-auto object-contain" />
          <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2">Admin</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <NavLink to="/" className="p-4 border-t border-border text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground flex items-center gap-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to store
        </NavLink>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-border p-3 flex gap-2 overflow-x-auto">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `text-[10px] tracking-[0.2em] uppercase px-3 py-2 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {n.label}
            </NavLink>
          ))}
        </div>
        <div className="p-6 md:p-10 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
