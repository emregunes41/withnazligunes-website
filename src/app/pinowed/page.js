import { prisma } from '@/lib/prisma';
import BookingFlow from './BookingFlow';
import { Calendar, FileSignature, CreditCard } from 'lucide-react';

export default async function PinowedHome() {
  const initialPackages = await prisma.photographyPackage.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' }
  });

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
        <div>
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
        </div>
      </section>

      {/* Booking Form Interface (Dynamic Client Component) */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
        <div style={{ 
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '2rem', 
          padding: '3rem 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
        }}>
          <BookingFlow initialPackages={initialPackages} />
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
