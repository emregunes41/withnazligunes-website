import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function FailPage() {
  return (
    <div className="pinowed-theme" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <XCircle size={80} color="#EF4444" style={{ marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Ödeme Başarısız</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '3rem' }}>
        Ödeme işlemi sırasında bir hata oluştu veya işlem iptal edildi. Lütfen tekrar deneyin veya bizimle iletişime geçin.
      </p>
      <Link href="/pinowed" style={{ textDecoration: 'none', background: 'var(--primary)', color: '#fff', padding: '1rem 2rem', borderRadius: '1rem', fontWeight: 600 }}>
        Tekrar Dene
      </Link>
    </div>
  );
}
