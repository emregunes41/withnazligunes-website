"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, Mail, ChevronRight, CheckCircle, CreditCard, FileText } from "lucide-react";

export default function BookingFlow({ initialPackages }) {
  const [step, setStep] = useState(1); // 1: Package, 2: Details/Contract, 3: Payment
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", date: "", notes: "" });
  const [contractAccepted, setContractAccepted] = useState(false);
  const [paytrToken, setPaytrToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startPayment = async () => {
    if (!contractAccepted) return alert("Lütfen sözleşmeyi onaylayın.");
    setIsLoading(true);

    try {
      // 1. Create a temporary reservation in DB to get an ID (Optional, or just create it in the checkout route)
      // For PayTR we need a merchant_oid. We can generate a temporary one or save to DB first.
      
      const res = await fetch("/api/paytr/checkout", {
        method: "POST",
        body: JSON.stringify({
          merchant_oid: "PNW_" + Date.now(), // Unique ID
          email: formData.email,
          payment_amount: parseInt(selectedPackage.price.replace(/[^0-9]/g, "")) * 100, // in kurus
          user_name: formData.name,
          user_phone: formData.phone,
          user_address: "Online Digital Service",
          user_basket: JSON.stringify([[selectedPackage.name, selectedPackage.price, 1]])
        })
      });

      const data = await res.json();
      if (data.token) {
        setPaytrToken(data.token);
        setStep(3);
      } else {
        alert("Ödeme başlatılamadı: " + data.error);
      }
    } catch (err) {
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Progress Stepper */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ 
            width: "40px", height: "40px", borderRadius: "50%", 
            display: "flex", alignItems: "center", justifyContent: "center",
            background: step >= s ? "var(--primary)" : "var(--bg-card)",
            color: step >= s ? "#fff" : "var(--text-muted)",
            fontWeight: 700, border: "1px solid var(--border)",
            transition: "all 0.3s"
          }}>
            {s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
          >
            {initialPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                onClick={() => { setSelectedPackage(pkg); setStep(2); }}
                style={{ 
                  background: 'var(--bg)', border: selectedPackage?.id === pkg.id ? '2px solid var(--primary)' : '1px solid var(--border)', 
                  padding: '2rem', borderRadius: '1.5rem', cursor: 'pointer', transition: 'all 0.2s'
                }}
                className="glass-hover"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pkg.name}</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{pkg.price}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{pkg.description}</p>
                <button style={{ 
                  width: '100%', background: 'var(--primary)', color: '#fff', 
                  border: 'none', padding: '0.8rem', borderRadius: '1rem', fontWeight: 600,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}>
                  Seç ve Devam Et <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg)', padding: '3rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", textAlign: "center" }}>Bilgilerinizi Girin</h2>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
                <input placeholder="Adınız Soyadınız" style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Phone size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
                <input placeholder="Telefon Numaranız" style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
                <input placeholder="E-posta Adresiniz" type="email" style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={{ position: "relative" }}>
                <Calendar size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }} />
                <input type="date" style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-card)", borderRadius: "1rem", border: "1px solid var(--border)" }}>
                <label style={{ display: "flex", gap: "0.75rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <input type="checkbox" checked={contractAccepted} onChange={e => setContractAccepted(e.target.checked)} />
                  <span>
                    Pinowed fotoğrafçılık hizmet sözleşmesini ve KVKK metnini okudum, onaylıyorum.
                  </span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "transparent", fontWeight: 600 }}>Geri</button>
                <button onClick={startPayment} disabled={isLoading} style={{ flex: 2, padding: "1rem", borderRadius: "1rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                  {isLoading ? "Hazırlanıyor..." : "Ödemeye Geç"} <CreditCard size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && paytrToken && (
          <motion.div 
            key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: "100%", minHeight: "650px", background: "#fff", borderRadius: "1.5rem", overflow: "hidden" }}
          >
            <iframe 
              src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`} 
              id="paytriframe" 
              frameBorder="0" 
              scrolling="no" 
              style={{ width: "100%", height: "650px" }}
            ></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
