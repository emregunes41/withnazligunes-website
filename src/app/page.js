"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
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
  Plus,
  Zap,
  Lightbulb,
  RefreshCw,
  Loader2,
  Cpu,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  Star,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { generateIdeasAction } from "./actions/generate-ideas";
import { registerMember } from "./actions/register-member";
import { activateTrial } from "./actions/activate-trial";
import { resendVerificationCode } from "./actions/resend-verification";
import { verifyCode } from "./actions/verify-code";
import { checkLogin } from "./actions/check-login";
import { getApprovedReviews, submitReview } from "./actions/reviews";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const NICHES = [
  { id: "moda", label: "Moda & Stil", icon: "👗" },
  { id: "tech", label: "Teknoloji", icon: "💻" },
  { id: "yemek", label: "Yemek & Tarif", icon: "🍳" },
  { id: "seyahat", label: "Seyahat", icon: "✈️" },
  { id: "finans", label: "Finans & Girişim", icon: "💰" },
  { id: "spor", label: "Spor & Fitness", icon: "💪" },
  { id: "gelisim", label: "Kişisel Gelişim", icon: "🌱" },
];

const TESTIMONIALS = [
  { name: "Ayşe Y.", handle: "@aysedesign", text: "Nazlı Hanım ile yaptığımız görüşme profilim için dönüm noktası oldu. İçerik ve kurgu fikirleri gerçekten vizyon katıyor. Kesinlikle tavsiye ederim!", stars: 5 },
  { name: "Mehmet K.", handle: "@mehmetstudio", text: "Aylık danışmanlık paketi sayesinde Instagram'da büyüme hızım 3 kat arttı. Özellikle senaryo ve kurgu desteği mükemmel. Çok teşekkürler.", stars: 5 },
  { name: "Selin T.", handle: "@selinbeauty", text: "Profil analizi ve bio düzenlemesi sonrası bile etkileşimlerim fark edilir şekilde arttı. İşini bu kadar profesyonel yapan biriyle çalışmak çok keyifli.", stars: 5 }
];

const STYLES = [
  { id: "minimalist", label: "Minimalist & Sade", icon: "✨" },
  { id: "energetic", label: "Enerjik & Dinamik", icon: "⚡" },
  { id: "aesthetic", label: "Estetik & Cinematic", icon: "🎞️" },
  { id: "educational", label: "Eğitici & Bilgilendirici", icon: "📚" },
  { id: "story", label: "Hikaye Anlatıcılığı", icon: "📖" },
];

const RECOMMENDATIONS = {
  moda: {
    minimalist: {
      ideas: [
        {
          title: "Kapsül Gardırop Sırları",
          desc: "Az eşyayla 15+ kombin yaparak sürdürülebilir moda üzerinden bağ kurun. Minimalist yaşam tarzını modayla birleştirin.",
          scenario: "1. Hook: 'Elinizde sadece 5 parça olsa kaç kombin yapabilirsiniz? Ben 15 yaptım!' \n2. Body: Her parçayı farklı ortamlar için (iş, kahve, akşam) eşleştir. \n3. CTA: 'Senin favori parçan hangisi? Yorumlara yaz!'"
        },
        {
          title: "Nötr Tonların Gücü",
          desc: "Baştan aşağı bej/beyaz giyinmenin 'pahalı' görünme sırlarını anlatın. Sessiz lüks (quiet luxury) akımına odaklanın.",
          scenario: "1. Hook: 'Old money estetiği için binlerce dolar harcamanıza gerek yok.' \n2. Body: Dokuların (keten, ipek, pamuk) önemini ve ton sür ton giyinmeyi göster. \n3. CTA: 'Hangi dokuyu daha çok seviyorsun?'"
        },
        {
          title: "Aksesuarla Değişim",
          desc: "Tek bir elbiseyi 3 farklı takı/çanta setiyle nasıl dönüştürürsünüz? Detayların bütünü nasıl değiştirdiğini kanıtlayın.",
          scenario: "1. Hook: 'Aynı elbiseyle hem düğüne hem işe gidilir mi?' \n2. Body: Önce sade, sonra gösterişli aksesuarlarla geçiş yap. \n3. CTA: 'Gündüz mü gece mi favorin?'"
        }
      ],
      tip: "Arka planını nötr tonlarda tut ve doğal ışığı maksimum seviyede kullan.",
    },
    energetic: {
      ideas: [
        {
          title: "Hızlı Geçişli Kombinler",
          desc: "Müzik ritmine göre kıyafet değiştirdiğiniz, yüksek enerjili bir Reels. Dinamik geçişler izleyiciyi tutar.",
          scenario: "1. Hook: Parmağını şıklatınca kıyafetin değişsin. \n2. Body: Haftanın her günü için bir kombin. \n3. CTA: 'Sence en iyisi hangisi?'"
        },
        {
          title: "Bu Sezonun 3 Favorisi",
          desc: "Mağazada denediğiniz ve kesinlikle alınması gereken parçalar. Samimi bir alışveriş turu hissi verin.",
          scenario: "1. Hook: 'Bu parçalar yakında tükenecek, benden söylemesi!' \n2. Body: Ürünleri üzerinde göster ve neden sevdiğini 1-2 kelimeyle anlat. \n3. CTA: 'Link isteyenler yorumlara Link yazsın!'"
        },
        {
          title: "Renk Bloklama (Color Blocking)",
          desc: "Zıt renkleri cesurca kullanarak dikkat çekici bir stil oluşturma rehberi.",
          scenario: "1. Hook: 'Sıkıcı kombinlerden bıktınız mı? Renkleri konuşturun!' \n2. Body: Turuncu ve mavi gibi zıt renkleri nasıl dengelediğini göster. \n3. CTA: 'Sen en çok hangi iki rengi yakıştırıyorsun?'"
        }
      ],
      tip: "Trend müziklerin beat-drop noktalarına göre geçişlerini ayarla, enerjin yüksek olsun!",
    },
    educational: {
      ideas: [
        {
          title: "Vücut Tipine Göre Giyim",
          desc: "Hangi kesimlerin hangi vücut tipinde daha iyi durduğunu gösteren rehber. Bilimsel ve estetik yaklaşın.",
          scenario: "1. Hook: 'Boyunuzu daha uzun göstermek istiyorsanız buraya bakın.' \n2. Body: Bel yüksekliği ve paça boyu gibi detayları yan yana karşılaştırmalı göster. \n3. CTA: 'Daha fazla tüyo için takip et!'"
        },
        {
          title: "Kumaş Dedektifi",
          desc: "Kumaş içeriklerini okuma ve kaliteli parçayı anlama rehberi. Polyester vs Pamuk karşılaştırması yapın.",
          scenario: "1. Hook: 'Paranızın karşılığını almak istiyorsanız etiketleri okuyun.' \n2. Body: Farklı kumaş türlerini dokularıyla hissettir ve uzun ömürlülüklerini anlat. \n3. CTA: 'Dolabında en çok hangi kumaş var?'"
        },
        {
          title: "Kombin Matematik Formülü",
          desc: "Her sabah ne giyeceğim derdine son veren 3-layer kuralı. Pratik ve hızlı stil tüyoları.",
          scenario: "1. Hook: '5 dakikada mükemmel görünmenin bir formülü var.' \n2. Body: Base layer, middle layer ve accessory adımlarını göster. \n3. CTA: 'Hangi adımı genelde unutuyorsun?'"
        }
      ],
      tip: "Bilgileri ekranda 'bullet point' olarak göster ki izleyici ekran görüntüsü alabilsin.",
    },
    aesthetic: {
      ideas: [
        {
          title: "Cinematic Hazırlık (GRWM)",
          desc: "Yavaş çekimler ve loş ışıkla hazırlık sürecinizi sanatsallaştırın. Atmosfer yaratmaya odaklanın.",
          scenario: "1. Hook: Güneş ışığının vurduğu bir ayna ve sabah kahvesi. \n2. Body: Kıyafetlerin asansörde veya sokaktaki yansımaları. \n3. CTA: 'Huzurlu bir gün dilerim...'"
        },
        {
          title: "Vintage Keşifleri",
          desc: "İkinci el veya vintage parçaları modern parçalarla harmanlama estetiği.",
          scenario: "1. Hook: 'Bu parçanın 30 yıllık olduğuna kim inanır?' \n2. Body: Vintage bir ceketle modern bir jean kombinini şık çekimlerle sun. \n3. CTA: 'Eski mi yeni mi senin tarzın?'"
        },
        {
          title: "Shadow & Light Play",
          desc: "Işık ve gölge oyunlarını kullanarak kıyafetlerin dokusunu ön plana çıkaran sanatsal çekimler.",
          scenario: "1. Hook: Gölgelerin arasında beliren şık bir silüet. \n2. Body: Işığın kumaş üzerindeki yansımasını makro çekimlerle göster. \n3. CTA: 'Işığını yansıt!'"
        }
      ],
      tip: "Renk paletine (Color Grading) önem ver, yumuşak tonlar estetik algıyı artırır.",
    },
    story: {
      ideas: [
        {
          title: "Stil Yolculuğum",
          desc: "Eski hallerinizden bugünkü tarzınıza geçişinizi anlatan ilham verici video.",
          scenario: "1. Hook: 'Moda anlayışım nasıl değişti? Sürpriz sona hazır olun.' \n2. Body: Yıllar içindeki tarz değişimini fotoğraflarla anlat. \n3. CTA: 'Senin tarzın nasıl değişti?'"
        },
        {
          title: "Bir Parçanın Hikayesi",
          desc: "Sizin için manevi değeri olan bir kıyafetin arkasındaki duygusal hikaye.",
          scenario: "1. Hook: 'Bu elbise sadece bir kumaş değil, bir hatıra.' \n2. Body: O kıyafeti aldığın veya giydiğin özel bir anıyı anlat. \n3. CTA: 'Senin dolabının en hikayeli parçası ne?'"
        },
        {
          title: "Alışveriş Pişmanlıklarım",
          desc: "Daha önce aldığınız ama hiç giymediğiniz parçalar üzerinden verdiğiniz stil dersleri.",
          scenario: "1. Hook: 'Paramı çöpe attığım 3 parça...' \n2. Body: Neden hata yaptığını ve bir daha alırken nelere dikkat edeceğini anlat. \n3. CTA: 'Senin en büyük alışveriş pişmanlığın ne?'"
        }
      ],
      tip: "Kendi sesinle (Voiceover) konuşmak samimiyetinizi 2 katına çıkarır.",
    }
  },
  tech: {
    minimalist: {
      ideas: [
        {
          title: "Kablosuz ve Sade Setup",
          desc: "Masanızdaki gereksiz kablolardan kurtulma ve minimal çalışma alanı. Verimliliği artıran düzen.",
          scenario: "1. Hook: Masanın eski dağınık hali ve yeni hali. \n2. Body: Kablo düzenleyici ve minimalist aksesuarları göster. \n3. CTA: 'Masa düzenine 1-10 arası kaç verirsin?'"
        },
        {
          title: "Dijital Minimalizm",
          desc: "Telefonunuzu sadeleştirerek dikkatinizi nasıl geri kazanırsınız? Uygulama temizliği ve sade ana ekran.",
          scenario: "1. Hook: 'Telefonunuz sizi yönetmesin, siz onu yönetin.' \n2. Body: Uygulama klasörleme ve gereksiz bildirimleri kapatma tüyoları. \n3. CTA: 'Günde kaç saat ekrana bakıyorsun?'"
        },
        {
          title: "Geleceğin Teknolojisi: Şık Ürünler",
          desc: "Tasarımıyla göz dolduran, evinizi veya ofisinizi güzelleştiren teknolojik aletler.",
          scenario: "1. Hook: 'Hem akıllı hem de çok şık.' \n2. Body: Şeffaf tasarımlar veya mat bitişli yeni nesil cihazları incele. \n3. CTA: 'Tasarım mı performans mı?'"
        }
      ],
      tip: "Çekimlerde aşırı 'RGB' ışık yerine yumuşak, beyaz/sıcak ışık kullan.",
    },
    energetic: {
      ideas: [
        {
          title: "iPhone Gizli Özelliği",
          desc: "Kimsenin bilmediği, hayat kolaylaştıran bir iOS kısayolu. Keşfedilmeyi bekleyen pratikler.",
          scenario: "1. Hook: 'Telefonunuzda bu özelliği hala kullanmıyor musunuz?' \n2. Body: Adım adım ayarları göster. \n3. CTA: 'Kaydet ki unutma!'"
        },
        {
          title: "Unboxing: Hızlandırılmış",
          desc: "Müzikle senkronize, hızlı kesimli ve yüksek ses geçişli (ASMR) kutu açılışı.",
          scenario: "1. Hook: Kutunun kapağının havada süzülerek açılması. \n2. Body: Ürünün içinden çıkan her parçanın hızlıca gösterilmesi. \n3. CTA: 'Kutudan ne çıksın istersin?'"
        },
        {
          title: "Setup Build (Time-lapse)",
          desc: "Boş bir masanın profesyonel bir oyuncu veya yazılımcı setup'ına dönüşmesi.",
          scenario: "1. Hook: 'Karanlıktan ışığa: Yeni odamın doğuşu!' \n2. Body: Time-lapse ile masanın kurulması ve ışıkların yanması. \n3. CTA: 'Senin setup favorin ne?'"
        }
      ],
      tip: "Videonun ilk 3 saniyesinde mutlaka şaşırtıcı bir sonuç göster (Hook).",
    },
    educational: {
      ideas: [
        {
          title: "Yapay Zeka ile Verimlilik",
          desc: "İşlerinizi 10 kat hızlandıracak 3 yapay zeka aracı. Modern dünyanın yeni asistanları.",
          scenario: "1. Hook: 'Yapay zeka işinizi elinizden almayacak, onu kullananlar alacak.' \n2. Body: Araçları ekran kaydıyla hızlıca tanıt. \n3. CTA: 'Takipte kal!'"
        },
        {
          title: "Yazılımcı Olmak İsteyenlere",
          desc: "2026 yılında yazılıma nereden başlanır? Yol haritası ve temel diller.",
          scenario: "1. Hook: 'Zengin olmak için değil, çözüm üretmek için kodlayın.' \n2. Body: Frontend, backend ve mobil geliştirme farklarını basitleştirerek anlat. \n3. CTA: 'Hangi dili öğrenmek istersin?'"
        },
        {
          title: "Sanal Gerçeklik (VR) Geleceği",
          desc: "VR ve AR teknolojilerinin günlük hayatımızı nasıl değiştireceğine dair öngörüler.",
          scenario: "1. Hook: 'Şu an bir gözlüğün içinden dünyayı izliyorum.' \n2. Body: Mevcut VR uygulamalarını ve gelecek vizyonunu paylaş. \n3. CTA: 'Sanal dünya mı gerçek dünya mı?'"
        }
      ],
      tip: "Karmaşık terimleri analogiler kullanarak açıkla, herkesin anlayabileceği dil kullan.",
    },
    aesthetic: {
      ideas: [
        {
          title: "ASMR Klavye Deneyimi",
          desc: "Mekanik klavye sesleri ve makro çekimlerle teknoloji estetiği. İşitsel ve görsel tatmin.",
          scenario: "1. Hook: Klavyeye basan bir el ve yüksek kaliteli ses. \n2. Body: Tuşların ve ışıkların makro (yakın) çekimleri. \n3. CTA: 'Sesi sevenler buraya!'"
        },
        {
          title: "Cyberpunk Şehir Gezisi",
          desc: "Teknolojinin şehir ışıklarıyla buluştuğu neon atmosferli cinematic bir video.",
          scenario: "1. Hook: Karanlıkta parlayan bir akıllı saat veya telefon. \n2. Body: Şehirdeki dijital ekranların ve ışıkların arasından geçişler. \n3. CTA: 'Gelecek burada mı?'"
        },
        {
          title: "Product Cinematic B-Roll",
          desc: "En sevdiğiniz teknolojik ürünün profesyonel reklam filmi gibi çekimi.",
          scenario: "1. Hook: Ürünün üzerine düşen zarif bir ışık süzmesi. \n2. Body: Kameranın ürün etrafında yavaşça dönmesi ve detaylar. \n3. CTA: 'Tasarım harikası mı?'"
        }
      ],
      tip: "Detay çekimlerde (Macro) yüksek çözünürlük ve sığ alan derinliği kullan.",
    }
  },
  default: {
    minimalist: {
      ideas: [
        {
          title: "Sabah Rutinim",
          desc: "Güne sade ve odaklı başlamanın 3 basit adımı. Zihinsel netliği artıran sabah ritüelleri.",
          scenario: "1. Hook: Telefonu uçak modunda bırakmanın huzuru. \n2. Body: Meditasyon, okuma ve planlama. \n3. CTA: 'Senin sabah ritüelin ne?'"
        },
        {
          title: "Dijital Detoks Günü",
          desc: "Bir gün boyunca tüm ekranlardan uzak kalmanın verdiği yenilenme hissi.",
          scenario: "1. Hook: 'Bugün tüm bildirimleri susturdum.' \n2. Body: Doğa yürüyüşü, kitap okuma ve gerçek insanlarla bağ kurma. \n3. CTA: 'En son ne zaman ekransız bir gün geçirdin?'"
        },
        {
          title: "Az Çoktur (Less is More)",
          desc: "Evdeki veya zihindeki kalabalıkları atarak özgürleşme süreci.",
          scenario: "1. Hook: 'Dağınıklık zihni yorar.' \n2. Body: Kullanılmayan eşyaların elenmesi ve ferahlayan alanların gösterilmesi. \n3. CTA: 'Bugün neyi hayatından çıkaracaksın?'"
        }
      ],
      tip: "Gürültüden uzak, temiz ses kaydı almayı unutma.",
    },
    energetic: {
      ideas: [
        {
          title: "Bu Hatayı Sakın Yapma!",
          desc: "Sektörünüzde yeni başlayanların yaptığı en büyük yanlış. Deneyimle sabitlenmiş uyarılar.",
          scenario: "1. Hook: 'Eğer X sonucunu istiyorsan, Y yapmayı hemen bırak!' \n2. Body: Nedenini ve doğrusunu hızlıca anlat. \n3. CTA: 'Daha fazlası için profilime bak!'"
        },
        {
          title: "Motivation Boost",
          desc: "Düşük enerjili anlarda modunuzu yükseltecek 3 hızlı aksiyon.",
          scenario: "1. Hook: 'Atalet seni yenmesin, uyan!' \n2. Body: Soğuk duş, sert bir müzik ve 10 şınav gibi hızlı eylemleri göster. \n3. CTA: 'Senin enerjini ne yükseltir?'"
        },
        {
          title: "Challenge Time",
          desc: "Takipçilerinizi de dahil edebileceğiniz 7 günlük bir gelişim meydan okuması.",
          scenario: "1. Hook: '7 günde hayatımızı değiştiriyoruz, hazır mısın?' \n2. Body: Her gün yapılacak basit ama etkili görevi açıkla. \n3. CTA: 'Katılanlar yoruma Katılıyorum yazsın!'"
        }
      ],
      tip: "Videonun temposunu hiç düşürme, hızlı kesimler (Jump cuts) kullan.",
    },
    educational: {
      ideas: [
        {
          title: "Sıfırdan Başlama Rehberi",
          desc: "Herhangi bir konuda uzmanlaşmak için izlenecek 3 durak. Öğrenme sürecini kolaylaştırın.",
          scenario: "1. Hook: 'Sıfırdan X olmak imkansız değil.' \n2. Body: 1. Adım Eğitim, 2. Uygulama, 3. Geri Bildirim. \n3. CTA: 'Sen hangi aşamadasın?'"
        },
        {
          title: "Bilişsel Yanılgılar",
          desc: "Karar verirken bizi yanıltan psikolojik mekanizmaların kısa açıklaması.",
          scenario: "1. Hook: 'Neden hep yanlış seçimler yapıyoruz?' \n2. Body: Bir psikolojik deneyi veya kuralı basitçe anlat. \n3. CTA: 'Daha önce bunu yaşamış mıydın?'"
        },
        {
          title: "3 Dakikada Uzmanlık",
          desc: "Karmaşık görünen bir konunun en basit ve can alıcı noktalarını özetleyen video.",
          scenario: "1. Hook: 'X konusunu 3 dakikada çözüyoruz.' \n2. Body: Whiteboard veya görsellerle konuyu basitleştir. \n3. CTA: 'Sırada hangi konu olsun?'"
        }
      ],
      tip: "İnsanlara 'Neden'ini anlat, sonra 'Nasıl'ına geç.",
    },
    aesthetic: {
      ideas: [
        {
          title: "Bir Günün Özeti (Moody)",
          desc: "Hayatınızdan kesitlerin cinematic kurgusu. Melankolik ve estetik sahneler.",
          scenario: "1. Hook: Şık bir mekan girişi veya gün doğumu. \n2. Body: Estetik yemekler, kitaplar ve detaylar. \n3. CTA: 'Anı yaşa...'"
        },
        {
          title: "Vibe Check: Rainy Day",
          desc: "Yağmurlu bir günde evdeki huzurlu anların ve kahve keyfinin estetiği.",
          scenario: "1. Hook: Cama vuran yağmur damlaları ve buğulu bir cam. \n2. Body: Battaniye, kitap, mum ışığı ve sıcak kahve sahneleri. \n3. CTA: 'Yağmuru sever misin?'"
        },
        {
          title: "Golden Hour Magic",
          desc: "Günün en güzel ışığında çekilmiş, yüksek kaliteli ve rüya gibi sekanslar.",
          scenario: "1. Hook: Güneş batarken parlayan saçlar veya bir manzara. \n2. Body: Işığın yumuşak dokunuşlarıyla zenginleşen sahneler. \n3. CTA: 'Huzur burada...'"
        }
      ],
      tip: "Slow motion ve doğru müzik seçimi her şeyi estetikleştirir.",
    },
    story: {
      ideas: [
        {
          title: "Nereden Nereye?",
          desc: "Başarı hikayenizi veya zorlandığınız bir süreci samimiyetle paylaşın. İlham verici dönüm noktaları.",
          scenario: "1. Hook: 'Bana yapamazsın dediklerinde başladığım yer burasıydı.' \n2. Body: Başlangıçtaki zorluklar ve dönüm noktaları. \n3. CTA: 'Senin ilham kaynağın ne?'"
        },
        {
          title: "Bir Kayıp Hikayesi",
          desc: "Bir başarısızlıktan veya kayıptan çıkardığınız en büyük ders.",
          scenario: "1. Hook: 'Her zaman kazanmıyoruz, bazen öğreniyoruz.' \n2. Body: Kaybettiğin zamanki hislerini ve nasıl ayağa kalktığını anlat. \n3. CTA: 'Senin düştüğünde tutunduğun şey ne?'"
        },
        {
          title: "Görünmez Emek",
          desc: "Dışarıdan kolay görünen bir işin arkasındaki saatler süren çalışmayı gösteren video.",
          scenario: "1. Hook: 'Sadece 15 saniye sürdüğünü sanıyorlar değil mi?' \n2. Body: Hazırlık, hatalar, denemeler ve final sonucun hızlı kesimi. \n3. CTA: 'Emek her zaman değerlidir!'"
        }
      ],
      tip: "Samimiyet en büyük virallik anahtarıdır.",
    }
  }
};

function AuthModal({ isOpen, onClose, mode, setMode }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (mode === "login") {
      // Önce hesap durumunu kontrol et
      const check = await checkLogin(data.email, data.password);

      if (check.status === "unverified") {
        setVerifyEmail(check.email);
        setMode("verify");
        setSuccessMsg("Hesabın henüz doğrulanmamış. Onay kodu tekrar gönderildi.");
        setResendTimer(60);
        await resendVerificationCode(check.email);
        setLoading(false);
        return;
      }

      if (check.status === "error") {
        setError(check.message);
        setLoading(false);
        return;
      }

      // Hesap onaylı, giriş yap
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res.error) {
        setError("Hatalı email veya şifre.");
        setLoading(false);
      } else {
        onClose();
        setLoading(false);
        window.location.reload();
      }
    } else {
      const res = await registerMember(data);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setVerifyEmail(res.email);
        setMode("verify");
        setSuccessMsg("Kayıt başarılı! Lütfen e-posta adresine gelen 6 haneli kodu gir.");
        setResendTimer(60);
      }
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError("");
    const res = await resendVerificationCode(verifyEmail);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccessMsg("Kod başarıyla yeniden gönderildi.");
      setResendTimer(60);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.target);
    const code = formData.get("code");

    const res = await verifyCode(verifyEmail, code);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccessMsg("Hesabınız doğrulandı! Şimdi giriş yapabilirsiniz.");
      setMode("login");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="auth-modal glass glow-gold" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <button className="modal-close" onClick={onClose}><X /></button>
        
        {mode === "verify" ? (
          <div className="verify-container">
            <button onClick={() => setMode("register")} className="back-btn-simple">
              <ArrowLeft size={16} /> Geri Dön
            </button>
            <h3 className="modal-title">E-posta Doğrulama</h3>
            <p className="modal-subtitle">
              <strong>{verifyEmail}</strong> adresine gönderdiğimiz 6 haneli onay kodunu girin.
            </p>

            <form onSubmit={handleVerify} className="auth-form mt-6">
              <div className="form-group">
                <input 
                  type="text" 
                  name="code" 
                  maxLength={6} 
                  required 
                  placeholder="000000" 
                  className="glass verification-input" 
                  autoFocus
                />
              </div>

              {error && <p className="auth-error">{error}</p>}
              {successMsg && <p className="auth-success" style={{ color: "var(--primary)", fontSize: "0.85rem", textAlign: "center", marginBottom: "1rem" }}>{successMsg}</p>}

              <button type="submit" disabled={loading} className="btn-primary glow-gold w-full mt-4">
                {loading ? "Doğrulanıyor..." : "Kodu Onayla"}
              </button>

              <div className="resend-box mt-4 text-center">
                <button 
                  type="button" 
                  onClick={handleResend} 
                  disabled={loading || resendTimer > 0}
                  className="resend-link"
                  style={{ color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--primary)', cursor: resendTimer > 0 ? 'default' : 'pointer', background: 'none', border: 'none', fontSize: '0.85rem' }}
                >
                  {resendTimer > 0 ? `Kodu Yeniden Gönder (${resendTimer}s)` : "Kodu Yeniden Gönder"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
          <button 
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Giriş Yap
          </button>
          <button 
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Üye Ol
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Ad Soyad</label>
              <input type="text" name="name" required placeholder="Nazlı Güneş" className="glass" />
            </div>
          )}
          
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" name="email" required placeholder="merhaba@withnazligunes.com" className="glass" />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" name="password" required placeholder="••••••••" className="glass" />
          </div>

          {mode === "register" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Cinsiyet</label>
                  <select name="gender" className="glass">
                    <option value="">Seçiniz</option>
                    <option value="Kadın">Kadın</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Yaş</label>
                  <input type="number" name="age" placeholder="25" className="glass" />
                </div>
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input type="tel" name="phone" placeholder="0555 ••• •• ••" className="glass" />
              </div>
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary glow-gold w-full">
            {loading ? "İşleniyor..." : (mode === "login" ? "Giriş Yap" : "Kayıt Ol")}
          </button>

          <div className="auth-divider">
            <span>veya</span>
          </div>

          <button 
            type="button" 
            onClick={() => signIn("google")} 
            className="btn-google w-full glass"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
            Google ile {mode === 'login' ? 'Giriş Yap' : 'Devam Et'}
          </button>
        </form>
        </>
        )}
      </motion.div>
    </div>
  );
}

function ReviewModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const res = await submitReview(formData);
    
    if (res.error) {
      setMsg({ type: "error", text: res.error });
    } else {
      setMsg({ type: "success", text: res.success });
      setTimeout(() => {
        onClose();
        setMsg({ type: "", text: "" });
      }, 2000);
    }
    setLoading(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="auth-modal glass glow-gold" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <button className="modal-close" onClick={onClose}><X /></button>
        <h3 className="modal-title">Deneyimini Paylaş</h3>
        <p className="modal-subtitle">Yorumun onaylandıktan sonra ana sayfada görünecektir.</p>

        <form onSubmit={handleSubmit} className="auth-form mt-4">
          <div className="form-group">
            <label>Ad Soyad</label>
            <input type="text" name="name" required placeholder="Adınız Soyadınız" className="glass" />
          </div>
          <div className="form-group">
            <label>Instagram Kullanıcı Adı</label>
            <input type="text" name="handle" required placeholder="@kullaniciadi" className="glass" />
          </div>
          <div className="form-group">
            <label>Puan</label>
            <select name="rating" className="glass">
              <option value="5">5 Yıldız - Mükemmel</option>
              <option value="4">4 Yıldız - Çok İyi</option>
              <option value="3">3 Yıldız - Orta</option>
              <option value="2">2 Yıldız - Kötü</option>
              <option value="1">1 Yıldız - Çok Kötü</option>
            </select>
          </div>
          <div className="form-group">
            <label>Yorumunuz</label>
            <textarea name="text" required placeholder="Deneyimlerinizi buraya yazabilirsiniz..." className="glass" rows={4} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}></textarea>
          </div>

          {msg.text && (
            <p className={msg.type === "error" ? "auth-error" : "auth-success"} style={{ textAlign: "center", marginBottom: "1rem" }}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary glow-gold w-full">
            {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" vs "register"
  const [dynamicReviews, setDynamicReviews] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      const res = await getApprovedReviews();
      setDynamicReviews(res);
    }
    loadReviews();
  }, []);

  const services = [
    {
      title: "Birebir Danışmanlık",
      desc: "45 dakikalık yoğun, hedefe yönelik online strateji toplantısı.",
      photo: "/hero-nazli.jpg",
    },
    {
      title: "Sosyal Medya Eğitimleri",
      desc: "Başlangıçtan ileri seviyeye sosyal medya yönetimi eğitimleri.",
      photo: "/assets/photos/IMG_4326.jpg",
    },
    {
      title: "İçerik Kurgusu",
      desc: "Profilinize ve kitlenize özel video/içerik senaryo planlaması.",
      photo: "/assets/photos/Tezza-9494.JPG",
    },
    {
      title: "UGC Çekimleri",
      desc: "Markalar için kullanıcı odaklı, özgün içerik üretimi.",
      photo: "/assets/photos/Görüntü 11.03.2026 00.01.JPG",
    },
  ];

  return (
    <div className="main-wrapper">
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
            {status === "authenticated" ? (
              <>
                <li>
                  <a href="/profil" className="nav-profile-link">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profil" className="nav-profile-img" />
                    ) : (
                      <div className="nav-profile-circle">{session.user.name?.[0] || 'U'}</div>
                    )}
                    <span>Profilim</span>
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => signOut()} 
                    className="nav-link-btn"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button 
                  onClick={() => { setAuthMode("login"); setAuthModalOpen(true); }}
                  className="nav-link-btn"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                >
                  Giriş Yap
                </button>
              </li>
            )}
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
            {status === "authenticated" ? (
              <>
                <a href="/profil" onClick={() => setMobileMenuOpen(false)}>Profilim</a>
                <a href="#" onClick={() => { signOut(); setMobileMenuOpen(false); }}>Çıkış Yap</a>
              </>
            ) : (
              <>
                <a href="#" onClick={() => { setAuthMode("login"); setAuthModalOpen(true); setMobileMenuOpen(false); }}>Giriş Yap</a>
                <a href="#" onClick={() => { setAuthMode("register"); setAuthModalOpen(true); setMobileMenuOpen(false); }}>Üye Ol</a>
              </>
            )}
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

      {/* Scattered Background Photos - Hidden on Mobile to prevent overflow */}
      <div className="floating-imgs-desktop">
        <motion.div 
          className="floating-img-container" 
          style={{ top: '15%', right: '-5%', width: '300px', height: '400px', rotate: '12deg' }}
          animate={{ y: [0, -20, 0], rotate: [12, 10, 12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src="/assets/photos/IMG_4102.JPG" alt="" />
      </motion.div>
    </div>

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

      <CreatorPanelSection session={session} onAuthRequired={(mode = "login") => { setAuthMode(mode); setAuthModalOpen(true); }} />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode} 
        setMode={setAuthMode} 
      />

      {/* SERVICES SECTION */}
      <hr className="section-divider" />
      <section className="section" id="hizmetler" style={{ position: 'relative' }}>
        <div className="floating-imgs-desktop">
          <motion.div 
            className="floating-img-container" 
            style={{ bottom: '-10%', left: '-10%', width: '350px', height: '450px', rotate: '-8deg', opacity: 0.1 }}
            animate={{ y: [0, 20, 0], rotate: [-8, -6, -8] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/assets/photos/IMG_4326.jpg" alt="" />
          </motion.div>
        </div>
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
              <div className="service-title-container">
                <img src={srv.photo} alt={srv.title} className="service-avatar" />
                <h3>{srv.title}</h3>
              </div>
              <p>{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRAININGS / DOWNLOADABLES */}
      <hr className="section-divider" />
      <section className="section" id="egitimler" style={{ position: 'relative' }}>
        <div className="floating-imgs-desktop">
          <motion.div 
            className="floating-img-container" 
            style={{ top: '5%', right: '-12%', width: '400px', height: '500px', rotate: '5deg' }}
            animate={{ y: [0, -30, 0], rotate: [5, 7, 5] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/assets/photos/Tezza-9494.JPG" alt="" />
          </motion.div>
        </div>
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
            "/assets/videos/reels-1.mp4",
            "/assets/videos/reels-2.mp4",
            "/assets/videos/reels-3.mp4",
            "/assets/videos/reels-4.mp4"
          ].map((src, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/withnazligunes"
              target="_blank"
              rel="noopener noreferrer"
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
                position: "relative",
                display: "block"
              }}
            >
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-300 pointer-events-none" />
            </motion.a>
          ))}
        </div>

      </section>

      {/* CTA BANNER */}
      <hr className="section-divider" />
      <section className="section" style={{ textAlign: "center", position: 'relative', overflow: 'hidden' }}>
        <div className="floating-imgs-desktop">
          <motion.div 
            className="floating-img-container" 
            style={{ bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', height: '300px', rotate: '-2deg', opacity: 0.05 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/assets/photos/Görüntü 11.03.2026 00.01.JPG" alt="" />
          </motion.div>
        </div>
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

      {/* TESTIMONIALS SECTION */}
      <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="section-title italic">Birlikte Başardıklarımız</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Danışanlarımın başarı hikayeleri ve deneyimleri.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          textAlign: 'left'
        }}>
          {(dynamicReviews.length > 0 ? dynamicReviews : TESTIMONIALS.map((t, i) => ({ ...t, id: i, stars: t.stars || 5 }))).map((t, i) => (
            <motion.div 
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ 
                padding: '2rem', 
                borderRadius: '2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', gap: '4px', color: 'var(--primary)' }}>
                {[...Array(t.rating || t.stars || 5)].map((_, idx) => (
                  <Star key={idx} size={16} style={{ fill: 'var(--primary)' }} />
                ))}
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>
                "{t.text}"
              </p>
              <div style={{ 
                marginTop: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid rgba(255,255,255,0.05)' 
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: '700',
                  background: 'rgba(200, 165, 92, 0.1)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(200, 165, 92, 0.2)'
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.handle}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button 
            onClick={() => setReviewModalOpen(true)}
            className="btn-primary glow-gold glass"
            style={{ padding: '1rem 2.5rem' }}
          >
            Sen de Deneyimini Paylaş →
          </button>
        </div>
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
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        mode={authMode}
        setMode={setAuthMode}
      />
      <ReviewModal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)} 
      />
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
    </div>
  );
}

function CreatorPanelSection({ session, onAuthRequired }) {
  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [activationSuccess, setActivationSuccess] = useState("");
  const { update } = useSession();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isTrialActive = isMounted && session?.user?.trialStartDate && 
    (new Date() - new Date(session.user.trialStartDate)) < 7 * 24 * 60 * 60 * 1000;
  const isLocked = !session || (!isTrialActive && session.user.role !== "ADMIN");

  const handleActivate = async (e) => {
    e.preventDefault();
    setIsActivating(true);
    setActivationError("");
    setActivationSuccess("");

    const formData = new FormData(e.target);
    const code = formData.get("code");

    try {
      const res = await activateTrial(code);
      if (res.error) {
        setActivationError(res.error);
      } else {
        setActivationSuccess(res.message);
        // Update session so isLocked becomes false
        await update({
          ...session.user,
          trialStartDate: res.trialStartDate,
          isTrialUsed: true,
        });
        // We'll let the session update trigger a re-render
      }
    } catch (err) {
      setActivationError("Aktivasyon sırasında bir hata oluştu.");
    } finally {
      setIsActivating(false);
    }
  };

  const handleNicheSelect = (id) => {
    if (isLocked) {
      onAuthRequired();
      return;
    }
    setSelectedNiche(id || "custom");
    setStep(2);
  };

  const currentNicheLabel = selectedNiche === "custom" ? customNiche : (NICHES.find(n => n.id === selectedNiche)?.label || customNiche);

  const handleStyleSelect = async (styleId) => {
    setSelectedStyle(styleId);
    setStep(3);
    
    setIsLoading(true);
    setAiRecommendations(null);
    setAiError(null);
    try {
      const res = await generateIdeasAction(currentNicheLabel, styleId);
      if (res && res.error) {
        setAiError(res.error);
      } else if (res && res.ideas && res.ideas.length > 0) {
        setAiRecommendations(res);
      } else {
        setAiError("ERR_EMPTY_RESULT: Beklenmedik boş sonuç.");
      }
    } catch (err) {
      console.error("AI Action Fatal Error:", err);
      setAiError("ERR_ACTION_CRASH: Sunucu iletişimi kesildi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaDetail = (idea) => {
    setSelectedIdea(idea);
    setStep(4);
  };

  const getRecommendations = () => {
    if (aiRecommendations) return aiRecommendations;
    const nicheKey = selectedNiche === "custom" ? "default" : selectedNiche;
    const nicheData = RECOMMENDATIONS[nicheKey] || RECOMMENDATIONS.default;
    return nicheData[selectedStyle] || RECOMMENDATIONS.default[selectedStyle];
  };

  const resetPanel = () => {
    setStep(1);
    setSelectedNiche("");
    setCustomNiche("");
    setSelectedStyle("");
    setSelectedIdea(null);
    setAiRecommendations(null);
    setAiError(null);
    setIsLoading(false);
  };

  return (
    <section className="section" id="creator-panel" style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass creator-panel-card glow-gold"
      >
        <div className="creator-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <span className="section-badge" style={{ marginBottom: 0 }}>
              <Zap style={{ width: 12, height: 12 }} />
              İçerik Paneli
            </span>
            {isTrialActive && <TrialCountdown trialStartDate={session.user.trialStartDate} />}
          </div>
          <h2 className="section-title">Senin İçin Viral Fikirler</h2>
          <p className="section-subtitle">Nişini ve tarzını seç, Nazlı'nın senin için hazırladığı viral potansiyeli yüksek fikirleri gör.</p>
        </div>

        <div className="creator-panel-body" style={{ position: 'relative' }}>
          {isLocked && (
            <div className="lock-overlay">
              <div className="lock-content glass glow-gold" style={{ maxWidth: '450px' }}>
                {!session ? (
                  <>
                    <div className="lock-icon-circle">
                      <Zap style={{ width: 24, height: 24, color: "var(--primary)" }} />
                    </div>
                    <h3>Bu Bölüm Üyelere Özel</h3>
                    <p>Yapay zeka destekli viral fikir üreticisine erişmek için ücretsiz üye ol.</p>
                    <div className="lock-actions">
                      <button onClick={() => onAuthRequired("register")} className="btn-primary glow-gold">
                        Ücretsiz Kayıt Ol →
                      </button>
                      <button onClick={() => onAuthRequired("login")} className="btn-outline">
                        Giriş Yap
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lock-icon-circle">
                      <Zap style={{ width: 24, height: 24, color: "var(--primary)" }} />
                    </div>
                    {session.user.isTrialUsed && !isTrialActive ? (
                      <>
                        <h3>Deneme Süreniz Doldu</h3>
                        <p>İçerik Paneli erişim süreniz sona ermiştir. Yeni eğitim ve paketler için takipte kalın!</p>
                        <a href="/#hizmetler" className="btn-primary glow-gold mt-4">
                          Hizmetlere Göz At
                        </a>
                      </>
                    ) : (
                      <>
                        <h3>Hediye Kodunu Kullan</h3>
                        <p>1 haftalık ücretsiz deneme süresini başlatmak için aktivasyon kodunu gir.</p>
                        
                        <form onSubmit={handleActivate} className="trial-activate-form" style={{ width: '100%', marginTop: '1rem' }}>
                          <input 
                            type="text" 
                            name="code" 
                            placeholder="Aktivasyon Kodunu Girin" 
                            className="trial-input"
                            required
                          />
                          <button type="submit" disabled={isActivating} className="trial-btn">
                            {isActivating ? "Aktif Ediliyor..." : "Aktif Et"}
                          </button>
                        </form>
                        {activationError && <p className="auth-error mt-2" style={{ fontSize: '0.8rem' }}>{activationError}</p>}
                        {activationSuccess && <p className="profile-success mt-2" style={{ fontSize: '0.8rem' }}>{activationSuccess}</p>}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="step-content"
                style={{ filter: isLocked ? "blur(8px)" : "none", pointerEvents: isLocked ? "none" : "auto" }}
              >
                <div className="step-count">ADIM 1 / 2</div>
                <h3 className="step-heading">Hangi nişte içerik üretiyorsun?</h3>
                <div className="niche-grid">
                  {NICHES.map((n) => (
                    <button key={n.id} onClick={() => handleNicheSelect(n.id)} className="niche-btn glass glass-hover">
                      <span className="niche-icon">{n.icon}</span>
                      <span className="niche-label">{n.label}</span>
                    </button>
                  ))}
                  <div className="custom-niche-container glass">
                    <input 
                      type="text" 
                      placeholder="Kendi Nişini Yaz..." 
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && customNiche && handleNicheSelect("custom")}
                      className="custom-input"
                    />
                    <button 
                      onClick={() => customNiche && handleNicheSelect("custom")}
                      disabled={!customNiche}
                      className="custom-plus-btn"
                    >
                      <Plus style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="step-content"
              >
                <div className="step-count">ADIM 2 / 2</div>
                <div className="step-header-with-badge">
                  <h3 className="step-heading">İçerik tarzın nasıl olsun?</h3>
                  <div className="active-selection-badge">{currentNicheLabel}</div>
                </div>
                <div className="style-grid">
                  {STYLES.map((s) => (
                    <button key={s.id} onClick={() => handleStyleSelect(s.id)} className="style-btn glass glass-hover">
                      <span className="style-icon">{s.icon}</span>
                      <span className="style-label">{s.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="back-link">← Niş Seçimine Dön</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="results-content"
              >
                <div className="results-header">
                  <div className="results-badge-group">
                    <span className="res-badge">{currentNicheLabel}</span>
                    <span className="res-badge">{STYLES.find(s => s.id === selectedStyle)?.label}</span>
                    {aiError && <span className="res-badge error-badge"><Lightbulb size={12} /> Yapay Zeka Hazırlanıyor (v1.0.8)</span>}
                  </div>
                  <h3 className="results-heading">Yapay Zeka Önerileri</h3>
                </div>

                {isLoading ? (
                  <div className="ai-loading-container">
                    <div className="ai-loader-pulse" />
                    <Loader2 className="ai-spinner" />
                    <p className="ai-loading-text">Nazlı'nın Yapay Zekası Senin İçin Kurguluyor...</p>
                  </div>
                ) : aiRecommendations ? (
                  <>
                    <div className="ideas-container">
                      {aiRecommendations.ideas.map((idea, idx) => (
                        <motion.div 
                          key={idx} 
                          className="idea-item glass glass-hover"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          whileHover={{ scale: 1.02, borderColor: "var(--primary)" }}
                        >
                          <div className="idea-header">
                            <span className="idea-number">0{idx + 1}</span>
                            <div className="viral-indicator">
                              <Zap style={{ width: 10, height: 10 }} />
                              VİRAL
                            </div>
                          </div>
                          <h4 className="idea-item-title">{idea.title}</h4>
                          <p className="idea-desc">{idea.desc}</p>
                          <button onClick={() => handleIdeaDetail(idea)} className="btn-detail-view">
                            Senaryoyu Gör <ArrowRight style={{ width: 14, height: 14 }} />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    <div className="expert-insight-box glow-gold">
                      <div className="insight-header">
                        <Lightbulb className="w-5 h-5 text-gold" />
                        <span>Yapay Zeka Tüyosu</span>
                      </div>
                      <p className="insight-text">{aiRecommendations.tip}</p>
                    </div>
                  </>
                ) : aiError ? (
                  <div className="error-state-container glass glow-gold" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.5rem', background: 'rgba(255, 75, 75, 0.05)', border: '1px solid rgba(255, 75, 75, 0.2)' }}>
                    <div className="error-icon-box" style={{ marginBottom: '1.5rem', color: '#ff4b4b' }}>
                      <AlertTriangle size={48} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Yapay Zeka Hazırlanıyor (v1.1.9)</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', wordBreak: 'break-all' }}>
                      {aiError && aiError.includes("API_ERROR") ? `Detaylı Bilgi: ${aiError}` : "Nazlı'nın yapay zekası senin için fikirleri hazırlıyor. Lütfen bir saniye bekle..."}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      <button onClick={() => handleStyleSelect(selectedStyle)} className="btn-primary">
                        <RefreshCw size={18} /> Yeniden Dene
                      </button>
                      <button onClick={resetPanel} className="btn-reset">
                        Vazgeç
                      </button>
                    </div>
                    {aiError && <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: '2rem' }}>Hata Kodu: {aiError}</p>}
                  </div>
                ) : null}

                <div className="panel-actions" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
                  <button onClick={resetPanel} className="btn-outline">
                    <RefreshCw style={{ width: 18, height: 18 }} />
                    Yeniden Başla
                  </button>
                  <button onClick={() => handleStyleSelect(selectedStyle)} className="btn-outline">
                    <RefreshCw style={{ width: 18, height: 18 }} />
                    Fikirleri Beğenmedim, Değiştir
                  </button>
                  <a href="https://randevu.withnazligunes.com" className="btn-primary">
                    Birlikte Kurgulayalım →
                  </a>
                </div>
              </motion.div>
            )}

            {step === 4 && selectedIdea && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="detail-view-container"
              >
                <button onClick={() => setStep(3)} className="back-link">← Önerilere Dön</button>
                
                <div className="detail-card glass glow-gold">
                  <div className="detail-header">
                    <div className="viral-badge">
                      <Zap style={{ width: 12, height: 12 }} />
                      VİRAL SENARYO
                    </div>
                    <h3 className="detail-title">{selectedIdea.title}</h3>
                    <p className="detail-desc">{selectedIdea.desc}</p>
                  </div>

                  <div className="scenario-box glass">
                    <h4 className="scenario-heading">İçerik Akışı & Script</h4>
                    <div className="scenario-steps">
                      {selectedIdea.scenario.split('\n').map((line, i) => (
                        <div key={i} className="scenario-line">
                          <span className="line-dot" />
                          <p>{line.trim()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-actions">
                    <p className="detail-hint">Bu senaryoyu kendi tarzına göre uyarlayarak hemen çekime başlayabilirsin!</p>
                    <a href="https://randevu.withnazligunes.com" className="btn-primary glow-gold">
                      Nazlı ile Birlikte Çekelim
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}

function TrialCountdown({ trialStartDate }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!trialStartDate) return;

    const calculateTimeLeft = () => {
      const startDate = new Date(trialStartDate);
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

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [trialStartDate]);

  if (!isMounted || !timeLeft) return null;

  return (
    <div className="home-trial-countdown">
      <Clock size={14} />
      <span>Süre: {timeLeft.days}g {timeLeft.hours}s {timeLeft.minutes}d</span>
    </div>
  );
}
