import "./globals.css";

export const metadata = {
  title: "With Nazlı Güneş | Sosyal Medya Danışmanlığı",
  description: "Sosyal medya stratejisi, içerik kurgusu ve büyüme danışmanlığı. Birebir özel danışmanlık ile markanızı bir üst seviyeye taşıyın.",
  keywords: "sosyal medya danışmanlığı, içerik stratejisi, instagram büyüme, tiktok, UGC, nazlı güneş",
  openGraph: {
    title: "With Nazlı Güneş | Sosyal Medya Danışmanlığı",
    description: "Sosyal medya stratejisi, içerik kurgusu ve büyüme danışmanlığı.",
    type: "website",
    url: "https://withnazligunes.com",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
