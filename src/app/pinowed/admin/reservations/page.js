"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, User, Phone, Mail, FileText, CheckCircle, Clock } from "lucide-react";
import { getReservations, getPackages, createManualReservation, updateReservationStatus } from "../core-actions";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    brideName: "", bridePhone: "", brideEmail: "",
    groomName: "", groomPhone: "", groomEmail: "",
    eventDate: "", eventTime: "10:00", packageIds: [], notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [resData, pkgData] = await Promise.all([getReservations(), getPackages()]);
    setReservations(resData);
    setPackages(pkgData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createManualReservation(formData);
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ 
        brideName: "", bridePhone: "", brideEmail: "",
        groomName: "", groomPhone: "", groomEmail: "",
        eventDate: "", eventTime: "10:00", packageIds: [], notes: "" 
      });
      loadData();
    } else {
      alert("Hata: " + res.error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    await updateReservationStatus(id, status);
    loadData();
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case "CONFIRMED": return { background: "#DCFCE7", color: "#166534" };
      case "PENDING": return { background: "#FEF9C3", color: "#854D0E" };
      default: return { background: "#F3F4F6", color: "#374151" };
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Rezervasyonlar</h1>
          <p style={{ color: "var(--text-muted)" }}>Gelen tüm randevuları ve manuel girişleri buradan yönetebilirsin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: "var(--primary)", color: "#fff", padding: "0.75rem 1.5rem", 
            borderRadius: "0.75rem", border: "none", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.5rem"
          }}
        >
          <Plus size={20} /> Rezervasyon Gir
        </button>
      </div>

      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "1rem", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
            <tr>
              <th style={{ padding: "1.25rem", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.85rem" }}>Müşteri</th>
              <th style={{ padding: "1.25rem", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.85rem" }}>Tarih / Paket</th>
              <th style={{ padding: "1.25rem", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.85rem" }}>Durum</th>
              <th style={{ padding: "1.25rem", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.85rem" }}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1.25rem" }}>
                  <div style={{ fontWeight: 600 }}>{res.brideName} & {res.groomName}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
                    <Phone size={12} /> {res.bridePhone}
                  </div>
                </td>
                <td style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                    <Calendar size={14} color="var(--primary)" />
                    {new Date(res.eventDate).toLocaleDateString('tr-TR')} {res.eventTime && `| ${res.eventTime}`}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {res.packages.map(p => p.name).join(", ")} ({res.paidAmount || "0 TL"} / {res.totalAmount || "Hesaplanıyor"})
                  </div>
                </td>
                <td style={{ padding: "1.25rem" }}>
                  <span style={{ 
                    padding: "0.35rem 0.75rem", borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 600,
                    ...getStatusStyle(res.status)
                  }}>
                    {res.status === "CONFIRMED" ? "Onaylandı" : "Bekliyor"}
                  </span>
                </td>
                <td style={{ padding: "1.25rem" }}>
                  <select 
                    value={res.status}
                    onChange={(e) => handleStatusChange(res.id, e.target.value)}
                    style={{ padding: "0.4rem", borderRadius: "0.5rem", border: "1px solid var(--border)", fontSize: "0.85rem" }}
                  >
                    <option value="PENDING">Bekleyen</option>
                    <option value="CONFIRMED">Onayla</option>
                    <option value="COMPLETED">Tamamlandı</option>
                    <option value="CANCELLED">İptal Et</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 
        }}>
          <div style={{ background: "var(--bg)", padding: "2.5rem", borderRadius: "1.5rem", width: "100%", maxWidth: "600px" }}>
            <h2 style={{ marginBottom: "1.5rem", fontWeight: 800 }}>Yeni Rezervasyon Gir</h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input 
                placeholder="Gelin Adı Soyadı" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.brideName}
                onChange={(e) => setFormData({...formData, brideName: e.target.value})}
              />
              <input 
                placeholder="Damat Adı Soyadı" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.groomName}
                onChange={(e) => setFormData({...formData, groomName: e.target.value})}
              />
              <input 
                placeholder="Gelin Telefon" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.bridePhone}
                onChange={(e) => setFormData({...formData, bridePhone: e.target.value})}
              />
              <input 
                placeholder="Gelin E-posta" type="email" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.brideEmail}
                onChange={(e) => setFormData({...formData, brideEmail: e.target.value})}
              />
              <input 
                type="date" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              />
              <input 
                type="time" required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.eventTime}
                onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
              />
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", display: "block" }}>Paketler (Birden fazla seçebilirsin)</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", background: "var(--bg-card)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}>
                  {packages.map(pkg => (
                    <label key={pkg.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={formData.packageIds.includes(pkg.id)}
                        onChange={(e) => {
                          const ids = e.target.checked 
                            ? [...formData.packageIds, pkg.id]
                            : formData.packageIds.filter(id => id !== pkg.id);
                          setFormData({...formData, packageIds: ids});
                        }}
                      />
                      {pkg.name} ({pkg.price})
                    </label>
                  ))}
                </div>
              </div>
              <textarea 
                placeholder="Notlar (Opsiyonel)" 
                style={{ gridColumn: "span 2", padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)", minHeight: "80px" }}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
              <div style={{ gridColumn: "span 2", display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "transparent" }}>İptal</button>
                <button type="submit" disabled={isLoading} style={{ flex: 2, padding: "0.8rem", borderRadius: "0.75rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 600 }}>{isLoading ? "Kaydediliyor..." : "Kaydet ve Onayla"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
