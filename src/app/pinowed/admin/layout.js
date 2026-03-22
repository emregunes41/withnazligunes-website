"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, CalendarDays, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // If we are on the login page, don't render the sidebar
  if (pathname === "/pinowed/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/pinowed/admin/dashboard", icon: LayoutDashboard },
    { name: "Paketler", href: "/pinowed/admin/packages", icon: Package },
    { name: "Rezervasyonlar", href: "/pinowed/admin/reservations", icon: CalendarDays },
  ];

  return (
    <div className="pinowed-theme" style={{ display: "flex", minHeight: "100vh", background: "var(--bg-card)" }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: "280px", background: "var(--bg)", borderRight: "1px solid var(--border)", 
        padding: "2rem 1.5rem", display: "flex", flexDirection: "column" 
      }}>
        <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em", marginBottom: "3rem", paddingLeft: "0.5rem" }}>
          PINOWED.<span style={{ color: "var(--text-subtle)", fontSize: "1rem" }}>admin</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "0.75rem",
                  background: isActive ? "var(--primary-muted)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s"
                }} className="hover:bg-[var(--primary-muted)]">
                  <item.icon size={20} color={isActive ? "var(--primary)" : "var(--text-muted)"} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout (Since it requires a Server Action, we can use a small form or just a client click to an API, but for simplicity we can use an unstyled button that triggers the action, or just a Link to a logout route) */}
        <form action={async () => {
          "use server";
          const { cookies } = await import("next/headers");
          cookies().delete("admin_token");
          const { redirect } = await import("next/navigation");
          redirect("/pinowed/admin/login");
        }}>
          <button type="submit" style={{ 
            display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", 
            width: "100%", background: "transparent", border: "none", color: "#EF4444", 
            fontWeight: 500, cursor: "pointer", borderRadius: "0.75rem", transition: "all 0.2s",
            marginTop: "auto", textAlign: "left"
          }} className="hover:bg-red-50">
            <LogOut size={20} /> Çıkış Yap
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "3rem", overflowY: "auto" }}>
        {children}
      </main>

    </div>
  );
}
