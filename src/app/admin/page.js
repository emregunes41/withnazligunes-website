"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/app/actions/get-all-users";
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
  ShieldCheck
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
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
        fetchUsers();
      }
    }
  }, [status, session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      if (result.error) {
        setError(result.error);
      } else {
        setUsers(result.users);
      }
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gold mb-2">
              <ShieldCheck size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Yönetici Paneli</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Üye Yönetimi
            </h1>
            <p className="text-gray-400">Toplam {users.length} kayıtlı kullanıcı bulunuyor</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.open('https://randevu.withnazligunes.com/admin', '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-all font-bold text-sm"
            >
              Randevu Paneli <ExternalLink size={16} />
            </button>
            <button 
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold text-sm"
            >
              <ChevronLeft size={16} /> Siteye Dön
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <Search className="text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="İsim, e-posta veya telefon ile ara..."
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Users Table */}
        <div className="glass rounded-3xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Kullanıcı</th>
                  <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">İletişim</th>
                  <th className="p-4 font-bold text-sm text-gray-400 uppercase tracking-wider">Bilgiler</th>
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
                      <div className="text-sm space-y-1">
                        <p className="text-gray-300">
                          <span className="text-gray-500 italic uppercase text-[10px] mr-1">Cinsiyet:</span> 
                          {user.gender === 'female' ? 'Kadın' : user.gender === 'male' ? 'Erkek' : 'Belirtilmemiş'}
                        </p>
                        {user.age && (
                          <p className="text-gray-400">
                            <span className="text-gray-500 italic uppercase text-[10px] mr-1">Yaş:</span> 
                            {user.age}
                          </p>
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
                    <td colSpan="5" className="p-12 text-center text-gray-500 italic">
                      Aramanızla eşleşen bir kullanıcı bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        .border-gold {
          border-color: #D4AF37;
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
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
      `}</style>
    </div>
  );
}
