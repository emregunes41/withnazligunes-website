import { getPackages } from "./admin/core-actions";
import BookingFlow from "./BookingFlow";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function PinowedPage() {
  const packages = await getPackages();

  return (
    <main style={{ 
      position: "relative", 
      minHeight: "100vh", 
      width: "100%", 
      overflow: "hidden",
      background: "#000" // Fallback black
    }}>
      
      {/* Cinematic Background Video */}
      <div style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        zIndex: 0, overflow: "hidden" 
      }}>
        <video 
          autoPlay muted loop playsInline 
          style={{ 
            width: "100%", height: "100%", objectFit: "cover", 
            opacity: 0.6, filter: "brightness(0.7) contrast(1.1)" 
          }}
        >
          <source src="/pinowed/assets/hero.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay Gradient */}
        <div style={{ 
          position: "absolute", inset: 0, 
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
          zIndex: 1 
        }} />
      </div>

      {/* Hero Content Layer */}
      <div style={{ 
        position: "relative", zIndex: 10, 
        display: "flex", flexDirection: "column", 
        alignItems: "center", minHeight: "100vh", padding: "2rem" 
      }}>
        
        {/* Logo Container */}
        <div style={{ marginTop: "3rem", marginBottom: "4rem", textAlign: "center" }}>
          <div style={{ 
            width: "220px", height: "220px", 
            borderRadius: "50%", 
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.3)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto"
          }}>
            <Image 
              src="/pinowed/assets/logo.jpg" 
              alt="Pinowed Logo" 
              width={220} 
              height={220} 
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Global Floating Header Info */}
        <div style={{ textAlign: "center", marginBottom: "3rem", color: "#fff" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "1rem", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            Anılarını Ölümsüzleştir
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto" }}>
            Profesyonel dokunuşlarla en özel günlerini birer sanat eserine dönüştürüyoruz.
          </p>
        </div>

        {/* The Booking Flow Container (Glassmorphism Layer) */}
        <div style={{ 
          width: "100%", maxWidth: "1200px", 
          background: "rgba(255,255,255,0.03)", 
          backdropFilter: "blur(25px) saturate(180%)", 
          WebkitBackdropFilter: "blur(25px) saturate(180%)", 
          borderRadius: "3rem", 
          border: "1px solid rgba(255,255,255,0.12)", 
          padding: "3rem",
          boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5)",
          marginBottom: "5rem"
        }}>
          <BookingFlow initialPackages={packages} />
        </div>

        {/* Footer Info */}
        <footer style={{ padding: "4rem 2rem", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
          <p>© 2026 PINOWED Photography. Tüm hakları saklıdır.</p>
        </footer>

      </div>

      {/* Custom Styles for Glassmorphism effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary: #fff;
          --primary-muted: rgba(255,255,255,0.1);
          --bg: transparent;
          --bg-card: rgba(255,255,255,0.05);
          --border: rgba(255,255,255,0.15);
          --text: #fff;
          --text-muted: rgba(255,255,255,0.5);
        }
        body { background: #000; color: #fff; }
        .glass-hover:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.3) !important;
          transform: translateY(-5px);
        }
        input, select, textarea {
          background: rgba(255,255,255,0.05) !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        input::placeholder { color: rgba(255,255,255,0.3) !important; }
      `}} />

    </main>
  );
}
