"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Settings, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
            <button className="profile-menu-item active">
              <div className="profile-menu-item-content">
                <Package size={20} />
                <span>Satın Alınanlar</span>
              </div>
              <ChevronRight size={16} />
            </button>
            <button className="profile-menu-item disabled">
              <div className="profile-menu-item-content">
                <Settings size={20} />
                <span>Ayarlar (Yakında)</span>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Main Content */}
          <div className="profile-main">
            <div className="profile-empty-state glass">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
