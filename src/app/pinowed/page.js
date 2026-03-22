'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Camera, CreditCard, FileSignature } from 'lucide-react';
import Head from 'next/head';

const packages = [
  {
    id: 'pkg1',
    name: 'Sade Portre Paketi',
    desc: 'Kişisel marka ve portre çekimleri için en uygun, minimalist stüdyo paketi.',
    price: '₺7,500',
    features: ['2 Saatlik Stüdyo Çekimi', '15 Rötuşlanmış Kare', 'Tüm Ham Fotoğraflar', 'Dijital Teslimat']
  },
  {
    id: 'pkg2',
    name: 'Düğün / Hikaye Paketi',
    desc: 'En özel gününüzü sabahtan akşama kadar belgesel tadında ölümsüzleştiren elit paket.',
    price: '₺25,000',
    features: ['Tüm Gün Destek (10 Saat)', 'Düğün Klibi Dış Çekim', 'Özel Tasarım Albüm', 'Drone Çekimi']
  },
  {
    id: 'pkg3',
    name: 'Ticari Konsept',
    desc: 'Marka kimliğinizi yansıtacak, e-ticaret veya sosyal medya odaklı konsept fotoğrafçılığı.',
    price: '₺15,000',
    features: ['Yarı Gün (5 Saat) Çekim', 'Mekan Kurgusu', '30 Rötuşlanmış Kare', 'Kısa Video Reel Hediyesi']
  }
];

export default function PinowedHome() {
  return (
    <div className="pinowed-theme">
      {/* Navbar Minimal */}
      <nav style={{ padding: '2rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>
          PINOWED.
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '6rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ 
            display: 'inline-flex', padding: '0.5rem 1rem', background: 'var(--primary-muted)', 
            borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '2rem' 
          }}>
            PROFESYONEL FOTOĞRAFÇILIK & REZERVASYON
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            En saf anları <br/> ölümsüzleştiriyoruz.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Hayalinizdeki konsepti seçin, tarihinizi ayırtın ve sözleşmenizi saniyeler içinde online onaylayıp ödemenizi tamamlayın.
          </p>
        </motion.div>
      </section>

      {/* Booking Form Interface */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '2rem', 
          padding: '3rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
        }}>
          
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Paketinizi Seçin</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Sizin için hazırladığımız özel konsept paketler.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {packages.map((pkg, idx) => (
              <motion.div 
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ 
                  background: 'var(--bg)', border: '1px solid var(--border)', padding: '2rem', 
                  borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="glass-hover"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pkg.name}</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{pkg.price}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{pkg.desc}</p>
                
                <hr style={{ borderTop: '1px dashed var(--border)', borderBottom: 'none', margin: '0.5rem 0' }} />
                
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pkg.features.map((f, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button style={{ 
                  marginTop: 'auto', background: 'var(--primary)', color: '#fff', 
                  border: 'none', padding: '1rem', borderRadius: '1rem', fontWeight: 600,
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                }}>
                  Seç ve Devam Et <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature Highlights Minimal */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 6rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Calendar size={20} /> Yüzde Yüz Dijital Rezervasyon
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <FileSignature size={20} /> E-Sözleşme Onayı
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <CreditCard size={20} /> Güvenli Kredi Kartı Ödemesi
        </div>
      </section>

    </div>
  );
}
