"use client";

import Script from "next/script";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Video,
  BookOpen,
  Palette,
  Camera,
  ArrowRight,
  Clock,
  Download,
  GraduationCap,
  Users,
  Mail,
  Menu,
  X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: <Video className="w-5 h-5" />,
      title: "Birebir Danışmanlık",
      desc: "45 dakikalık yoğun, hedefe yönelik online strateji toplantısı.",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Sosyal Medya Eğitimleri",
      desc: "Başlangıçtan ileri seviyeye sosyal medya yönetimi eğitimleri.",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "İçerik Kurgusu",
      desc: "Profilinize ve kitlenize özel video/içerik senaryo planlaması.",
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "UGC Çekimleri",
      desc: "Markalar için kullanıcı odaklı, özgün içerik üretimi.",
    },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="nav-logo">
            <div className="nav-logo-circle">N</div>
            <span className="nav-logo-text">With Nazlı Güneş</span>
          </a>

          <ul className="nav-links">
            <li><a href="#hizmetler">Hizmetler</a></li>
            <li><a href="#egitimler">Eğitimler</a></li>
            <li><a href="#yakinda">Yakında</a></li>
            <li>
              <a
                href="https://randevu.withnazligunes.com"
                className="nav-cta"
              >
                Randevu Al
              </a>
            </li>
          </ul>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <a href="#hizmetler" onClick={() => setMobileMenuOpen(false)}>Hizmetler</a>
            <a href="#egitimler" onClick={() => setMobileMenuOpen(false)}>Eğitimler</a>
            <a href="#yakinda" onClick={() => setMobileMenuOpen(false)}>Yakında</a>
            <a
              href="https://randevu.withnazligunes.com"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Randevu Al →
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BG ORBS */}
      <div className="hero-bg-orb-1" />
      <div className="hero-bg-orb-2" />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            {/* Profile Photo Placeholder */}
            <div style={{ marginBottom: "1.5rem" }}>
              <img
                src="/hero-nazli.jpg"
                alt="Nazlı Güneş"
                className="profile-img float-animation"
              />
            </div>
          </motion.div>

          <motion.div
            className="hero-badge glass"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>Sosyal Medya Danışmanı & İçerik Stratejisti</span>
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            Sosyal Medyada
            <br />
            <span className="text-gradient-gold">Fark Yaratın.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            Merhaba, ben Nazlı Güneş. Sosyal medya stratejisi, içerik kurgusu ve
            marka büyümesi konularında danışmanlık yapıyorum. İçeriklerinizi bir
            üst seviyeye taşımak için birlikte çalışalım.
          </motion.p>

          <motion.p
            className="hero-tag"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            @withnazligunes
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <a href="https://randevu.withnazligunes.com" className="btn-primary glow-gold">
              <Video style={{ width: 20, height: 20 }} />
              Birebir Danışmanlık Al
              <ArrowRight style={{ width: 18, height: 18 }} />
            </a>
            <a href="#hizmetler" className="btn-outline">
              Hizmetleri Keşfet
            </a>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <hr className="section-divider" />
      <section className="section" id="hizmetler">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">
            <Sparkles style={{ width: 12, height: 12 }} />
            Hizmetler
          </span>
          <h2 className="section-title">Ne Yapıyorum?</h2>
          <p className="section-subtitle">
            Markanızın sosyal medyadaki varlığını güçlendirmek ve büyümenizi hızlandırmak için kapsamlı çözümler sunuyorum.
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((srv, i) => (
            <motion.div
              key={srv.title}
              className="service-card glass glass-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="service-card-icon">{srv.icon}</div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRAININGS / DOWNLOADABLES */}
      <hr className="section-divider" />
      <section className="section" id="egitimler">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">
            <GraduationCap style={{ width: 12, height: 12 }} />
            Eğitimler & İçerikler
          </span>
          <h2 className="section-title">Öğren & Uygula</h2>
          <p className="section-subtitle">
            Sosyal medya yolculuğunuzda size rehberlik edecek eğitimler ve indirilebilir kaynaklar.
          </p>
        </motion.div>

        <div className="services-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <motion.div
            className="service-card glass glass-hover"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="service-card-icon">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3>Rehberler & Kılavuzlar</h3>
            <ul className="download-list">
              <li>
                <a href="/assets/downloads/instagram-biyo-rehber.pdf" download>
                  <Download className="w-4 h-4" /> Biyografi Optimizasyonu
                </a>
              </li>
              <li>
                <a href="/assets/downloads/sosyal-medya-kaygi-rehberi.pdf" download>
                  <Download className="w-4 h-4" /> Sosyal Medya Kaygı Rehberi
                </a>
              </li>
              <li>
                <a href="/assets/downloads/trend-muzik-arsivi.pdf" download>
                  <Download className="w-4 h-4" /> Trend Müzik Arşivi
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="service-card glass glass-hover"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="service-card-icon">
              <Download className="w-5 h-5" />
            </div>
            <h3>Planlama Araçları</h3>
            <ul className="download-list">
              <li>
                <a href="/assets/downloads/sosyal-medya-planlayici.pdf" download>
                  <Download className="w-4 h-4" /> Sosyal Medya Planı
                </a>
              </li>
              <li>
                <a href="/assets/downloads/nis-calisma-kagidi.pdf" download>
                  <Download className="w-4 h-4" /> Niş Çalışma Kağıdı
                </a>
              </li>
              <li>
                <a href="/assets/downloads/instagram-safe-zone.png" download>
                  <Download className="w-4 h-4" /> Instagram Safe Zone
                </a>
              </li>
              <li>
                <a href="/assets/downloads/Withnazligunes Edits.mp4" download>
                  <Video className="w-4 h-4" /> withNazligunes Edits
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="service-card glass glass-hover"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <div className="service-card-icon" style={{ margin: "0 auto 1rem" }}>
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3>Eğitim Programları</h3>
            <p style={{ fontSize: "0.8rem" }}>Kapsamlı sosyal medya eğitimlerimiz üzerinde çalışıyoruz.</p>
            <div style={{ marginTop: "1.25rem" }}>
              <span className="coming-soon-badge">Hazırlanıyor</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMING SOON SECTION */}
      <hr className="section-divider" />
      <section className="section" id="yakinda">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">
            <Clock style={{ width: 12, height: 12 }} />
            Yakında
          </span>
          <h2 className="section-title">Instagram Reels</h2>
          <p className="section-subtitle">
            Sizlere daha iyi hizmet verebilmek için yeni özellikler hazırlıyorum.
          </p>
        </motion.div>

        <div className="coming-soon-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {[
            "DV8vX7liJo1",
            "DV0RaRYCPr3",
            "DVxz1hkCOk8",
            "DVvQdVuiLXv"
          ].map((id, i) => (
            <motion.div
              key={id}
              className="glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                borderRadius: "1rem",
                overflow: "hidden",
                aspectRatio: "9/16",
                background: "var(--bg-card)",
                position: "relative"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}>
                <iframe
                  src={`https://www.instagram.com/reel/${id}/embed/`}
                  width="100%"
                  height="1000px" // Fixed large height to ensure video is rendered fully
                  frameBorder="0"
                  scrolling="no"
                  allowtransparency="true"
                  style={{ 
                    border: "none",
                    transform: "scale(1.6)", // Zoom deep into the video
                    transformOrigin: "center center",
                    marginTop: "-50px" // Adjust vertical centering to hide footer better
                  }}
                ></iframe>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <hr className="section-divider" />
      <section className="section" style={{ textAlign: "center" }}>
        <motion.div
          className="glass glow-gold"
          style={{ padding: "4rem 2rem", borderRadius: "1.5rem", maxWidth: "800px", margin: "0 auto" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Sosyal Medyanızı <span className="text-gradient-gold">Dönüştürelim</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
            Birebir danışmanlık ile içerik stratejinizi oluşturun, büyüme hedeflerinize ulaşın.
          </p>
          <a href="https://randevu.withnazligunes.com" className="btn-primary glow-gold">
            <Video style={{ width: 20, height: 20 }} />
            Hemen Randevu Al
            <ArrowRight style={{ width: 18, height: 18 }} />
          </a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo-circle">N</div>
            <span className="footer-text">
              © 2026 <strong>With Nazlı Güneş</strong> — Tüm hakları saklıdır.
            </span>
          </div>
          <a
            href="https://randevu.withnazligunes.com"
            className="footer-link"
          >
            Randevu Al →
          </a>
        </div>
      </footer>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </>
  );
}
