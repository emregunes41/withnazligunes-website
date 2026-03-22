"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, Mail, ChevronRight, CreditCard, Clock, Info } from "lucide-react";

export default function BookingFlow({ initialPackages }) {
  const [step, setStep] = useState(1); // 1: Package, 2: Details/Contract, 3: Payment Type, 4: iFrame
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ 
    brideName: "", bridePhone: "", brideEmail: "", 
    groomName: "", groomPhone: "", groomEmail: "",
    date: "", time: "10:00", notes: "" 
  });
  const [contractAccepted, setContractAccepted] = useState(false);
  const [paymentType, setPaymentType] = useState("deposit"); // deposit, full, custom
  const [customAmount, setCustomAmount] = useState("");
  const [paytrToken, setPaytrToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPrice = () => parseInt(selectedPackage?.price.replace(/[^0-9]/g, "")) || 0;
  const getMinDeposit = () => Math.round(getPrice() * 0.2);

  const calculateFinalAmount = () => {
    if (paymentType === "full") return getPrice();
    if (paymentType === "deposit") return getMinDeposit();
    return parseInt(customAmount) || getMinDeposit();
  };

  const startPayment = async () => {
    if (!contractAccepted) return alert("Lütfen sözleşmeyi onaylayın.");
    
    const finalPrice = calculateFinalAmount();
    if (finalPrice < getMinDeposit()) return alert(`Minimum ödeme tutarı ${getMinDeposit()} TL'dir.`);

    setIsLoading(true);

    try {
      const res = await fetch("/api/paytr/checkout", {
        method: "POST",
        body: JSON.stringify({
          merchant_oid: "PNW_" + Date.now(),
          email: formData.brideEmail,
          payment_amount: finalPrice * 100, // in kurus
          user_name: `${formData.brideName} & ${formData.groomName}`,
          user_phone: formData.bridePhone,
          user_address: `Event Date: ${formData.date} ${formData.time}`,
          user_basket: JSON.stringify([[selectedPackage.name, `${finalPrice} TL`, 1]])
        })
      });

      const data = await res.json();
      if (data.token) {
        setPaytrToken(data.token);
        setStep(4);
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
        {[1, 2, 3, 4].map((s) => (
          <div key={s} style={{ 
            width: "35px", height: "35px", borderRadius: "50%", 
            display: "flex", alignItems: "center", justifyContent: "center",
            background: step >= s ? "var(--primary)" : "var(--bg-card)",
            color: step >= s ? "#fff" : "var(--text-muted)",
            fontWeight: 700, border: "1px solid var(--border)",
            fontSize: "0.85rem"
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
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '3rem' }}>{pkg.description}</p>
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
            style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", textAlign: "center" }}>Etkinlik Bilgileri</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Bride Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>GELİN BİLGİLERİ</h3>
                <input placeholder="Gelin Adı Soyadı" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} />
                <input placeholder="Gelin Telefon" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.bridePhone} onChange={e => setFormData({...formData, bridePhone: e.target.value})} />
                <input placeholder="Gelin E-posta" type="email" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.brideEmail} onChange={e => setFormData({...formData, brideEmail: e.target.value})} />
              </div>

              {/* Groom Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>DAMAT BİLGİLERİ</h3>
                <input placeholder="Damat Adı Soyadı" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} />
                <input placeholder="Damat Telefon" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.groomPhone} onChange={e => setFormData({...formData, groomPhone: e.target.value})} />
                <input placeholder="Damat E-posta" type="email" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.groomEmail} onChange={e => setFormData({...formData, groomEmail: e.target.value})} />
              </div>

              {/* Date & Time */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>TARİH & SAAT</h3>
                <input type="date" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>BAŞLANGIÇ SAATİ</h3>
                <input type="time" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                  value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
              </div>

              <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 700 }}>BİLMEMİZ GEREKENLER</h3>
                <textarea 
                  placeholder="Çekim mekanı, özel istekler veya eklemek istediğiniz detaylar..." 
                  style={{ padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", minHeight: "100px" }}
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "transparent", fontWeight: 600 }}>Geri</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: "1rem", borderRadius: "1rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700 }}>Ödeme Seçeneklerine Geç</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center" }}>Ödeme Yöntemini Seçin</h2>
            <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "2rem" }}>Paket Tutarı: <span style={{ fontWeight: 800, color: "var(--text)" }}>{selectedPackage?.price}</span></p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              <div 
                onClick={() => setPaymentType("deposit")}
                style={{ 
                  padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", 
                  background: paymentType === "deposit" ? "var(--primary-muted)" : "transparent",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>%20 Ön Ödeme (Kapora)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Rezervasyonun kesinleşmesi için minimum tutar.</div>
                </div>
                <div style={{ fontWeight: 800 }}>{getMinDeposit()} TL</div>
              </div>

              <div 
                onClick={() => setPaymentType("full")}
                style={{ 
                  padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", 
                  background: paymentType === "full" ? "var(--primary-muted)" : "transparent",
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>Tam Ödeme</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Paket tutarının tamamını şimdi ödeyin.</div>
                </div>
                <div style={{ fontWeight: 800 }}>{getPrice()} TL</div>
              </div>

              <div 
                onClick={() => setPaymentType("custom")}
                style={{ 
                  padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", 
                  background: paymentType === "custom" ? "var(--primary-muted)" : "transparent",
                  cursor: "pointer", display: "flex", flexDirection: "column", gap: "1rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700 }}>Belirli Bir Tutar Öde</div>
                  <Info size={16} color="var(--text-muted)" />
                </div>
                {paymentType === "custom" && (
                  <input 
                    type="number" 
                    placeholder={`${getMinDeposit()} TL'den az olamaz.`}
                    style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--primary)", width: "100%" }}
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", background: "#F9FAFB", borderRadius: "1rem", border: "1px solid var(--border)" }}>
              <label style={{ display: "flex", gap: "0.75rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                <input type="checkbox" checked={contractAccepted} onChange={e => setContractAccepted(e.target.checked)} />
                <span>Hizmet sözleşmesini ve KVKK metnini onaylıyorum.</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "transparent", fontWeight: 600 }}>Geri</button>
              <button onClick={startPayment} disabled={isLoading} style={{ flex: 2, padding: "1rem", borderRadius: "1rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                {isLoading ? "Yönlendiriliyor..." : `${calculateFinalAmount()} TL Öde`} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && paytrToken && (
          <motion.div 
            key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ width: "100%", background: "#fff", borderRadius: "1.5rem", overflow: "hidden" }}
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
