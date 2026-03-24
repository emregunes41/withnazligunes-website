"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Settings, LogOut, ChevronRight, Save, CheckCircle, ArrowLeft, Calendar, ShoppingBag, Clock, Video, FileText, Zap, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    setDataLoading(true);
    const res = await getUserData();
    if (res.user) {
      setUserData(res.user);
    }
    setDataLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await updateUser(data);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Bilgileriniz başarıyla güncellendi!");
      // Update the local session
      await update({
        name: data.name,
        gender: data.gender,
        age: data.age,
        phone: data.phone,
      });
    }
    setLoading(false);
  };

  const handleActivateTrial = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.target);
    const code = formData.get("code");
    
    const res = await activateTrial(code);
    
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(res.message);
      await update({
        ...session.user,
        trialStartDate: res.trialStartDate,
        isTrialUsed: true,
      });
      fetchUserData();
    }
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="loader glow-gold"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="profile-page h-full">
      <div className="profile-container">
        {/* Back Navigation */}
        <div className="profile-nav-top">
          <a href="/" className="profile-back-link glass">
            <ArrowLeft size={16} />
            <span>Ana Sayfaya Dön</span>
          </a>
        </div>

        {/* Header */}
        <div className="profile-header glass glow-gold">
          <div className="profile-avatar-wrapper">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name} 
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <User size={40} className="text-gold" />
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{session.user.name}</h1>
            <p className="profile-email">{session.user.email}</p>
            <div className="profile-badges">
              {/* Premium badge removed as requested */}
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="profile-logout-btn glass"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>

        {/* Content Grid */}
        <div className="profile-content-grid">
          {/* Sidebar / Menu */}
          <div className="profile-sidebar">
            <button 
              className={`profile-menu-item ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              <div className="profile-menu-item-content">
                <Package size={20} />
                <span>Satın Alınanlar</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <div className="profile-menu-item-content">
                <Settings size={20} />
                <span>Ayarlar</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            <AnimatePresence mode="wait">
              {activeTab === 'purchases' ? (
                <motion.div 
                  key="purchases"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="profile-purchases-container"
                >
                  {dataLoading ? (
                    <div className="profile-empty-state glass">
                      <div className="loader glow-gold"></div>
                      <p className="mt-4 text-text-muted">Bilgileriniz yükleniyor...</p>
                    </div>
                  ) : (!userData?.reservations?.length && !userData?.purchases?.length && !userData?.isTrialUsed) ? (
                    <div className="profile-empty-state glass">
                      <div className="profile-empty-icon">
                        <Package size={32} />
                      </div>
                      <h3 className="profile-empty-title">Henüz Bir İçerik Yok</h3>
                      <p className="profile-empty-text">
                        Satın almış olduğunuz eğitimler, dijital ürünler ve randevularınız burada listelenecektir.
                      </p>
                      <a href="/#hizmetler" className="profile-shop-btn btn-primary glow-gold">
                        Hizmetlere Göz At
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Trial Section */}
                      <TrialSection user={userData || session.user} onActivate={handleActivateTrial} loading={loading} />

                      {/* Digital Purchases Section (Premium Grid) */}
                      {(userData.purchases?.length > 0 || userData.isTrialUsed) && (
                        <div className="purchase-section">
                          <h3 className="section-title">
                            <ShoppingBag size={20} className="text-gold" />
                            Dijital Ürünlerim
                          </h3>
                          
                          <div className="purchase-grid">
                            {/* Virtual Trial Item - Premium Card */}
                            {userData.isTrialUsed && (
                              <div className="premium-purchase-card glass hover-glow border-gold-subtle">
                                <div className="card-inner">
                                  <div className="card-top">
                                    <div className="product-icon-wrapper trial">
                                      <Zap size={24} className="text-gold" />
                                    </div>
                                    <div className="product-badge trial">DENEME</div>
                                  </div>
                                  
                                  <div className="card-content">
                                    <h4 className="product-title">Viral İçerik Paneli (7 Günlük Deneme)</h4>
                                    <div className="product-meta-tags">
                                      <span className="tag">Hediye Kodu / Deneme</span>
                                      <span className="tag-dot">•</span>
                                      <span className="tag">
                                        {format(new Date(userData.trialStartDate), "dd MMM yyyy", { locale: tr })}
                                      </span>
                                    </div>
                                    
                                    {/* Remaining Time Badge inside card */}
                                    {(() => {
                                      const startDate = new Date(userData.trialStartDate);
                                      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                                      const now = new Date();
                                      const diff = endDate - now;
                                      if (diff > 0) {
                                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                                        return (
                                          <div className="trial-remaining-msg mt-3">
                                            <Clock size={14} />
                                            <span>Süre: {days} Gün {hours} Saat Kaldı</span>
                                          </div>
                                        );
                                      } else {
                                        return <div className="trial-expired-small mt-3">Süre Bitti</div>;
                                      }
                                    })()}
                                  </div>
                                  
                                  <div className="card-footer">
                                    <div className="product-price">Hediye</div>
                                    <button 
                                      onClick={() => router.push('/#creator-panel')} 
                                      className="btn-card-action glow-gold"
                                    >
                                      <span>İçeriğe Git</span>
                                      <ChevronRight size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Real Purchases - Premium Cards */}
                            {userData.purchases?.map((purchase) => {
                              const isCourse = purchase.productType?.toLowerCase().includes('eğitim') || purchase.productType?.toLowerCase().includes('video');
                              return (
                                <div key={purchase.id} className="premium-purchase-card glass hover-glow">
                                  <div className="card-inner">
                                    <div className="card-top">
                                      <div className={`product-icon-wrapper ${isCourse ? 'course' : 'asset'}`}>
                                        {isCourse ? <Video size={24} /> : <FileText size={24} />}
                                      </div>
                                      <div className={`product-badge ${isCourse ? 'course' : 'asset'}`}>
                                        {purchase.productType}
                                      </div>
                                    </div>
                                    
                                    <div className="card-content">
                                      <h4 className="product-title">{purchase.productName}</h4>
                                      <div className="product-meta-tags">
                                        <span className="tag">Dijital Ürün</span>
                                        <span className="tag-dot">•</span>
                                        <span className="tag">
                                          {format(new Date(purchase.purchaseDate), "dd MMM yyyy", { locale: tr })}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="card-footer">
                                      <div className="product-price">{purchase.price}</div>
                                      <button className="btn-card-action">
                                        <span>İçeriğe Git</span>
                                        <ChevronRight size={16} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="profile-settings-card glass"
                >
                  <h3 className="profile-settings-title">Profil Ayarları</h3>
                  <p className="profile-settings-subtitle">Kişisel bilgilerinizi güncelleyin.</p>

                  <form onSubmit={handleUpdate} className="profile-settings-form">
                    <div className="form-group">
                      <label>Ad Soyad</label>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={session.user.name} 
                        className="glass"
                        required 
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Cinsiyet</label>
                        <select name="gender" defaultValue={session.user.gender || ""} className="glass">
                          <option value="">Seçiniz</option>
                          <option value="Kadın">Kadın</option>
                          <option value="Erkek">Erkek</option>
                          <option value="Diğer">Diğer</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Yaş</label>
                        <input 
                          type="number" 
                          name="age" 
                          defaultValue={session.user.age || ""} 
                          className="glass" 
                          placeholder="25"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Telefon</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        defaultValue={session.user.phone || ""} 
                        className="glass"
                        placeholder="05•• ••• •• ••"
                      />
                    </div>

                    {error && <p className="auth-error">{error}</p>}
                    {success && (
                      <p className="profile-success">
                        <CheckCircle size={16} />
                        {success}
                      </p>
                    )}

                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="btn-primary glow-gold w-full mt-4 flex items-center justify-center gap-2"
                    >
                      {loading ? "Kaydediliyor..." : (
                        <>
                          <Save size={18} />
                          Değişiklikleri Kaydet
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrialSection({ user, onActivate, loading }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!user.trialStartDate) return;

    const calculateTimeLeft = () => {
      const startDate = new Date(user.trialStartDate);
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [user.trialStartDate]);

  const isExpired = user.trialStartDate && !timeLeft;

  return (
    <div className="trial-card glass glow-gold">
      <div className="trial-header">
        <div className="trial-title-group">
          <Zap className="text-gold" size={20} />
          <h3 className="trial-title">İçerik Paneli Erişimi</h3>
          <span className="trial-badge">Beta</span>
        </div>
        {user.trialStartDate && !isExpired && (
          <span className="trial-status-text">Deneme Süresi Aktif</span>
        )}
      </div>

      <div className="trial-content">
        {user.trialStartDate && !isExpired ? (
          <>
            <p>Deneme sürenin bitmesine kalan zaman:</p>
            <div className="countdown-grid">
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft?.days || 0}</span>
                <span className="countdown-label">Gün</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft?.hours || 0}</span>
                <span className="countdown-label">Saat</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft?.minutes || 0}</span>
                <span className="countdown-label">Dak.</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-value">{timeLeft?.seconds || 0}</span>
                <span className="countdown-label">San.</span>
              </div>
            </div>
          </>
        ) : isExpired ? (
          <div className="trial-expired-msg">
            <AlertCircle size={18} />
            <span>Deneme süreniz sona erdi.</span>
          </div>
        ) : (
          <p>Viral içerik paneline gitmek için <a href="/#creator-panel" className="text-gold font-600">tıklayın</a> ve aktivasyon kodunuzu kullanın.</p>
        )}
      </div>
    </div>
  );
}
