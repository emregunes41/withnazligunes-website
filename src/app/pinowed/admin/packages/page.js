"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Package as PackageIcon } from "lucide-react";
import { getPackages, createPackage, deletePackage } from "../core-actions";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", description: "", price: "", features: "", 
    category: "STANDARD", timeType: "FULL_DAY", maxCapacity: "1", addons: [] 
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  async function loadPackages() {
    const data = await getPackages();
    setPackages(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createPackage(formData);
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ 
        name: "", description: "", price: "", features: "", 
        category: "STANDARD", timeType: "FULL_DAY", maxCapacity: "1", addons: [] 
      });
      loadPackages();
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Bu paketi silmek istediğine emin misin?")) {
      await deletePackage(id);
      loadPackages();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Paket Yönetimi</h1>
          <p style={{ color: "var(--text-muted)" }}>Sitede görünen fotoğrafçılık paketlerini buradan düzenleyebilirsin.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: "var(--primary)", color: "#fff", padding: "0.75rem 1.5rem", 
            borderRadius: "0.75rem", border: "none", fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: "0.5rem"
          }}
        >
          <Plus size={20} /> Yeni Paket Ekle
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={{ 
            background: "var(--bg)", border: "1px solid var(--border)", 
            padding: "1.5rem", borderRadius: "1rem", position: "relative" 
          }}>
            <button 
              onClick={() => handleDelete(pkg.id)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "transparent", border: "none", color: "#EF4444", cursor: "pointer" }}
            >
              <Trash2 size={18} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <PackageIcon size={20} color="var(--primary)" />
              <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{pkg.name}</h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", background: "var(--primary-muted)", color: "var(--primary)", padding: "0.2rem 0.5rem", borderRadius: "0.4rem", fontWeight: 700 }}>
                {pkg.category}
              </span>
              <span style={{ fontSize: "0.7rem", background: "#f3f4f6", padding: "0.2rem 0.5rem", borderRadius: "0.4rem", fontWeight: 600 }}>
                {pkg.timeType} (K: {pkg.maxCapacity})
              </span>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{pkg.price} TL</div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem" }}>{pkg.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {pkg.features.map((f, i) => (
                <span key={i} style={{ background: "var(--bg-card)", fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "0.5rem", border: "1px solid var(--border)" }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 
        }}>
          <div style={{ background: "var(--bg)", padding: "2.5rem", borderRadius: "1.5rem", width: "100%", maxWidth: "500px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h2 style={{ marginBottom: "1.5rem", fontWeight: 800 }}>Yeni Paket Oluştur</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input 
                  placeholder="Paket Adı" required 
                  style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  placeholder="Fiyat (Örn: 5000)" required 
                  style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <select 
                  style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="STANDARD">Standart Çekim</option>
                  <option value="EXTERIOR">Dış Çekim</option>
                  <option value="VIDEO">Video / Klip</option>
                </select>
                <select 
                  style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                  value={formData.timeType}
                  onChange={(e) => setFormData({...formData, timeType: e.target.value})}
                >
                  <option value="FULL_DAY">Tüm Gün</option>
                  <option value="SLOT">2 Saatlik Periyot</option>
                  <option value="MORNING">Gündüz</option>
                  <option value="EVENING">Akşam</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Aynı anda maks. kapasite:</span>
                <input 
                  type="number" required 
                  style={{ width: "80px", padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                />
              </div>

              <textarea 
                placeholder="Özellikler (Virgülle ayırarak yaz)" 
                required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)" }}
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
              />

              <div style={{ border: "1px dashed var(--border)", padding: "1rem", borderRadius: "0.75rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ekstralar (Add-ons)</div>
                <button 
                  type="button"
                  onClick={() => {
                    const title = prompt("Ekstra adı?");
                    const price = prompt("Fiyatı (TL)?");
                    if (title && price) setFormData({...formData, addons: [...formData.addons, { title, price }]});
                  }}
                  style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid var(--primary)", color: "var(--primary)", background: "transparent" }}
                >
                  + Yeni Ekstra Ekle
                </button>
                <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {formData.addons.map((a, i) => (
                    <span key={i} style={{ fontSize: "0.7rem", background: "#f3f4f6", padding: "0.2rem 0.5rem", borderRadius: "0.4rem" }}>
                      {a.title} (+{a.price} TL)
                    </span>
                  ))}
                </div>
              </div>

              <textarea 
                placeholder="Kısa Açıklama" 
                required 
                style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)", minHeight: "60px" }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "transparent", cursor: "pointer" }}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  style={{ flex: 2, padding: "0.8rem", borderRadius: "0.75rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 600, cursor: "pointer" }}
                >
                  {isLoading ? "Kaydediliyor..." : "Paketi Yayınla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
