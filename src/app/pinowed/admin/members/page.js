import { prisma } from "@/lib/prisma";
import { User as UserIcon, Mail, Phone, Calendar, UserCircle } from "lucide-react";

export default async function AdminMembersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
          Üye Yönetimi
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Sisteme kayıtlı toplam {users.length} üye bulunuyor.
        </p>
      </div>

      <div style={{ 
        background: "var(--bg)", borderRadius: "1.5rem", border: "1px solid var(--border)", 
        overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" 
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Kullanıcı</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>İletişim</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Detaylar</th>
              <th style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--text-muted)", fontSize: "0.875rem" }}>Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-gray-50/50">
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {user.image ? (
                      <img src={user.image} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ 
                        width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary-muted)", 
                        display: "flex", alignItems: "center", justify: "center", color: "var(--primary)" 
                      }}>
                        <UserIcon size={20} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{user.name || "İsimsiz Kullanıcı"}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.role}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                      <Mail size={14} color="var(--text-muted)" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                        <Phone size={14} color="var(--text-muted)" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {user.gender && (
                      <div style={{ fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Cinsiyet:</span> {user.gender}
                      </div>
                    )}
                    {user.age && (
                      <div style={{ fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Yaş:</span> {user.age}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
