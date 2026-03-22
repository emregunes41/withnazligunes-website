import { LayoutDashboard } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Fetch quick stats
  const totalPackages = await prisma.photographyPackage.count();
  const totalReservations = await prisma.reservation.count();
  const pendingReservations = await prisma.reservation.count({ where: { status: "PENDING" } });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Genel Bakış</h1>
        <p style={{ color: "var(--text-muted)" }}>Pinowed yönetim paneline hoş geldin.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Toplam Paket</div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{totalPackages}</div>
        </div>

        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Tüm Randevular</div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{totalReservations}</div>
        </div>

        <div style={{ background: "var(--bg)", border: "1px solid var(--primary)", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 12px var(--primary-muted)" }}>
          <div style={{ color: "var(--primary)", fontSize: "0.9rem", marginBottom: "0.5rem", fontWeight: 600 }}>Bekleyen Onaylar</div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{pendingReservations}</div>
        </div>

      </div>
    </div>
  );
}
