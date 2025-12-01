import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mektep Test Tizimi - Onlayn test tapsırıw platforması",
  description: "Mektep o'qıwshıları ushın onlayn test tapsırıw hám nátiyjelerin kóriw platforması",
  openGraph: {
    title: "Mektep Test Tizimi",
    description: "Onlayn test tapsırıw platforması",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Mektep Test Tizimi",
    description: "Onlayn test tapsırıw platforması",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
