"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Phone, Mail, ChevronRight, CreditCard, Clock, Info, Check } from "lucide-react";
import { savePendingReservation, checkAvailability } from "./admin/core-actions";

export default function BookingFlow({ initialPackages }) {
  const [step, setStep] = useState(1); // 1: Package, 2: Details/Addons, 3: Payment Type, 4: iFrame
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [formData, setFormData] = useState({ 
    brideName: "", bridePhone: "", brideEmail: "", 
    groomName: "", groomPhone: "", groomEmail: "",
    date: "", time: "10:00", notes: "" 
  });
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [paymentType, setPaymentType] = useState("deposit"); // deposit, full, custom
  const [customAmount, setCustomAmount] = useState("");
  const [paytrToken, setPaytrToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Price Calculations
  const getPackagePrice = () => parseInt(selectedPackage?.price.replace(/[^0-9]/g, "")) || 0;
  const getAddonsPrice = () => selectedAddons.reduce((sum, a) => sum + (parseInt(a.price) || 0), 0);
  const getTotalPrice = () => getPackagePrice() + getAddonsPrice();
  const getMinDeposit = () => Math.round(getTotalPrice() * 0.2);

  const calculateFinalAmount = () => {
    if (paymentType === "full") return getTotalPrice();
    if (paymentType === "deposit") return getMinDeposit();
    return parseInt(customAmount) || getMinDeposit();
  };

  // Availability Check
  useEffect(() => {
    if (formData.date && selectedPackage) {
      verifyAvailability();
    }
  }, [formData.date, formData.time, selectedPackage]);

  async function verifyAvailability() {
    setIsCheckingAvailability(true);
    setAvailabilityError(null);
    const res = await checkAvailability(formData.date, selectedPackage.id, formData.time);
    if (!res.available) {
      setAvailabilityError(`Bu tarih/saat maalesef dolu (${selectedPackage.name} için kapasite doldu).`);
    }
    setIsCheckingAvailability(false);
  }

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.title === addon.title)) {
      setSelectedAddons(selectedAddons.filter(a => a.title !== addon.title));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const startPayment = async () => {
    if (!contractAccepted) return alert("Lütfen sözleşmeyi onaylayın.");
    if (availabilityError) return alert(availabilityError);
    
    const finalPrice = calculateFinalAmount();
    if (finalPrice < getMinDeposit()) return alert(`Minimum ödeme tutarı ${getMinDeposit()} TL'dir.`);

    setIsLoading(true);

    try {
      // 1. Save Pending Reservation to DB
      const saveRes = await savePendingReservation({
        ...formData,
        packageId: selectedPackage.id,
        totalAmount: `${getTotalPrice()} TL`,
        paidAmount: `${finalPrice} TL`,
        selectedAddons: selectedAddons
      });

      if (!saveRes.success) throw new Error(saveRes.error);

      // 2. Get PayTR Token
      const res = await fetch("/api/paytr/checkout", {
        method: "POST",
        body: JSON.stringify({
          merchant_oid: saveRes.id,
          email: formData.brideEmail,
          payment_amount: finalPrice * 100,
          user_name: `${formData.brideName} & ${formData.groomName}`,
          user_phone: formData.bridePhone,
          user_address: `Event: ${formData.date} ${formData.time}`,
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
      alert("Hata: " + err.message);
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
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
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
                  <span style={{ fontSize: '1rem', fontWeight: 800 }}>{pkg.price} TL</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {pkg.timeType === "FULL_DAY" ? "TÜM GÜN" : pkg.timeType === "SLOT" ? "2 SAATLİK ÇEKİM" : pkg.timeType === "MORNING" ? "GÜNDÜZ" : "AKŞAM"}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{pkg.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                  {pkg.features.slice(0, 3).map((f, i) => (
                    <span key={i} style={{ fontSize: "0.7rem", background: "#f3f4f6", padding: "0.2rem 0.5rem", borderRadius: "0.4rem" }}>{f}</span>
                  ))}
                </div>
                <button style={{ 
                  width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '1rem', fontWeight: 600,
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
            style={{ maxWidth: '850px', margin: '0 auto', background: 'var(--bg)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", textAlign: "center" }}>Rezervasyon Detayları</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
              
              {/* Left Column: Forms */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>GELİN ADI SOYADI</label>
                    <input style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                      value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>DAMAT ADI SOYADI</label>
                    <input style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                      value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} />
                  </div>
                  <input placeholder="Gelin Telefon" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                    value={formData.bridePhone} onChange={e => setFormData({...formData, bridePhone: e.target.value})} />
                  <input placeholder="Gelin E-posta" type="email" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                    value={formData.brideEmail} onChange={e => setFormData({...formData, brideEmail: e.target.value})} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>TARİH</label>
                    <input type="date" style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }} 
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  {selectedPackage.timeType === "SLOT" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>SAAT PERİYODU</label>
                      <select style={{ padding: "0.8rem", borderRadius: "1rem", border: "1px solid var(--border)" }}
                        value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                        {["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {availabilityError && <div style={{ color: "#EF4444", fontSize: "0.85rem", fontWeight: 600 }}>⚠️ {availabilityError}</div>}

                <textarea 
                  placeholder="Bilmemiz gereken notlar..." 
                  style={{ padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", minHeight: "80px" }}
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              {/* Right Column: Add-ons */}
              <div style={{ background: "var(--bg-card)", padding: "1.5rem", borderRadius: "1.5rem", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", color: "var(--primary)" }}>PAKET EKSTRALARI</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {selectedPackage.addons?.map((addon, i) => (
                    <div 
                      key={i} 
                      onClick={() => toggleAddon(addon)}
                      style={{ 
                        padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", 
                        background: selectedAddons.find(a => a.title === addon.title) ? "#fff" : "transparent",
                        cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "18px", height: "18px", border: "2px solid var(--primary)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {selectedAddons.find(a => a.title === addon.title) && <Check size={12} color="var(--primary)" />}
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{addon.title}</span>
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>+{addon.price} TL</span>
                    </div>
                  ))}
                  {(!selectedPackage.addons || selectedPackage.addons.length === 0) && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Bu paket için ek hizmet bulunmuyor.</p>}
                </div>
              </div>

            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "transparent", fontWeight: 600 }}>Geri</button>
              <button onClick={() => setStep(3)} disabled={!formData.date || availabilityError} style={{ flex: 2, padding: "1rem", borderRadius: "1rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700 }}>
                Ödeme Adımına Geç ({getTotalPrice()} TL)
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center" }}>Ödeme Yöntemini Seçin</h2>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ color: "var(--text-muted)" }}>Toplam Tutar: <span style={{ fontWeight: 800, color: "var(--text)" }}>{getTotalPrice()} TL</span></p>
              {selectedAddons.length > 0 && <p style={{ fontSize: "0.8rem", color: "var(--primary)" }}>{selectedAddons.length} adet ekstra dahil edildi.</p>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div onClick={() => setPaymentType("deposit")} style={{ padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", background: paymentType === "deposit" ? "var(--primary-muted)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700 }}>%20 Ön Ödeme (Kapora)</div><div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Rezervasyon için minimum tutar.</div></div>
                <div style={{ fontWeight: 800 }}>{getMinDeposit()} TL</div>
              </div>
              <div onClick={() => setPaymentType("full")} style={{ padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", background: paymentType === "full" ? "var(--primary-muted)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700 }}>Tam Ödeme</div><div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Paket tutarının tamamı.</div></div>
                <div style={{ fontWeight: 800 }}>{getTotalPrice()} TL</div>
              </div>
              <div onClick={() => setPaymentType("custom")} style={{ padding: "1.5rem", borderRadius: "1.25rem", border: "1px solid var(--border)", background: paymentType === "custom" ? "var(--primary-muted)" : "transparent", cursor: "pointer", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontWeight: 700 }}>Belirli Bir Tutar</div><Info size={16} color="var(--text-muted)" /></div>
                {paymentType === "custom" && <input type="number" placeholder={`Min: ${getMinDeposit()} TL`} style={{ padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid var(--primary)", width: "100%" }} value={customAmount} onChange={e => setCustomAmount(e.target.value)} onClick={e => e.stopPropagation()} />}
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
              <button onClick={startPayment} disabled={isLoading || isCheckingAvailability} style={{ flex: 2, padding: "1rem", borderRadius: "1rem", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                {isLoading ? "Yönlendiriliyor..." : `${calculateFinalAmount()} TL Öde`} <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && paytrToken && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: "100%", background: "#fff", borderRadius: "1.5rem", overflow: "hidden" }}>
            <iframe src={`https://www.paytr.com/odeme/guvenli/${paytrToken}`} id="paytriframe" frameBorder="0" scrolling="no" style={{ width: "100%", height: "650px" }}></iframe>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
