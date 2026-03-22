import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Package, Settings, LogOut, ChevronRight, Save, CheckCircle } from "lucide-react";
import { updateUser } from "@/app/actions/update-user";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('purchases');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
              <span className="profile-badge">
                Premium Üye
              </span>
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
                  className="profile-empty-state glass"
                >
                  <div className="profile-empty-icon">
                    <Package size={32} />
                  </div>
                  <h3 className="profile-empty-title">Henüz Bir İçerik Yok</h3>
                  <p className="profile-empty-text">
                    Satın almış olduğunuz eğitimler, dijital ürünler ve özel içerikler burada listelenecektir.
                  </p>
                  <a href="/#hizmetler" className="profile-shop-btn btn-primary glow-gold">
                    Eğitimlere Göz At
                  </a>
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
