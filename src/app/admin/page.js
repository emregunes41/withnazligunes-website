"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/app/actions/get-all-users";
import { getAllReservations } from "@/app/actions/get-all-reservations";
import { 
  Users, 
  Search, 
  ExternalLink, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  CalendarCheck,
  Inbox,
  Filter,
  DollarSign,
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("users"); // "users" or "reservations"
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      if (session.user.role !== "ADMIN") {
        router.push("/profil");
      } else {
        fetchData();
      }
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, reservationsRes] = await Promise.all([
        getAllUsers(),
        getAllReservations()
      ]);

      if (usersRes.error) setError(usersRes.error);
      else setUsers(usersRes.users);

      if (reservationsRes.error) setError(reservationsRes.error);
      else setReservations(reservationsRes.reservations);

    } catch (err) {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const filteredReservations = reservations.filter((res) =>
    res.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.groomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.bridePhone?.includes(searchTerm) ||
    res.id?.includes(searchTerm)
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Panel Hazırlanıyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <div className="glass p-8 rounded-2xl border border-red-500/30 text-center max-w-md">
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="btn-primary w-full"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gold mb-2">
              <ShieldCheck size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Yönetici Paneli</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              {activeTab === "users" ? "Üye Yönetimi" : "Rezervasyon Yönetimi"}
            </h1>
            <p className="text-gray-400">
              {activeTab === "users" 
                ? `Toplam ${users.length} kayıtlı kullanıcı` 
                : `Toplam ${reservations.length} randevu kaydı`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold text-sm"
            >
              <ChevronLeft size={16} /> Siteye Dön
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
              activeTab === "users" ? "bg-gold text-black shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={18} /> Üyeler
          </button>
          <button 
            onClick={() => setActiveTab("reservations")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
              activeTab === "reservations" ? "bg-gold text-black shadow-lg" : "text-gray-400 hover:text-white"
            }`}
          >
            <CalendarCheck size={18} /> Rezervasyonlar
          </button>
        </div>

        {/* Search Bar */}
        <div className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <Search className="text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder={activeTab === "users" ? "İsim, e-posta veya telefon ile ara..." : "Gelin/Damat ismi veya telefon ile ara..."}
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content Table */}
        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === "users" ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Kullanıcı</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">İletişim</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider text-right">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 flex items-center justify-center overflow-hidden">
                            {user.image ? (
                              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={20} className="text-gold" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-gold transition-colors">{user.name || "İsimsiz"}</p>
                            <p className="text-xs text-gray-500 font-medium">#{user.id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Mail size={14} className="text-gray-500" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Phone size={14} className="text-gray-500" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} className="text-gray-500" />
                          {format(new Date(user.createdAt), "dd MMM yyyy", { locale: tr })}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          user.role === 'ADMIN' 
                          ? 'bg-gold/10 border-gold/40 text-gold' 
                          : 'bg-white/5 border-white/10 text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500 italic">Kullanıcı bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Müşteri / Çift</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Etkinlik Tarihi</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Paket / Ödeme</th>
                    <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReservations.length > 0 ? filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-bold text-white group-hover:text-gold transition-colors">
                            {res.brideName} {res.groomName ? `& ${res.groomName}` : ''}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone size={12} /> {res.bridePhone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar size={14} className="text-gold" />
                            {format(new Date(res.eventDate), "dd MMMM yyyy", { locale: tr })}
                          </div>
                          <div className="text-gray-500 flex items-center gap-2">
                            <Loader2 size={12} /> {res.eventTime || "Belirtilmemiş"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Briefcase size={14} className="text-gray-500" />
                            {res.packages?.[0]?.name || "Özel Randevu"}
                          </div>
                          <div className="flex items-center gap-2 font-bold text-gold">
                            <DollarSign size={14} />
                            {res.totalAmount || "0"} TL
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                            res.paymentStatus === 'PAID' 
                            ? 'bg-green-500/10 border-green-500/40 text-green-400' 
                            : 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400'
                          }`}>
                            {res.paymentStatus === 'PAID' ? 'ÖDENDİ' : 'BEKLİYOR'}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                            {res.status === 'CONFIRMED' ? 'ONAYLI' : 'İNCELENİYOR'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500 italic">Rezervasyon bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .text-gold {
          color: #D4AF37;
        }
        .bg-gold {
          background-color: #D4AF37;
        }
        .btn-primary {
          background: #D4AF37;
          color: black;
          font-weight: 800;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          transition: all 0.3s ease;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
