/**
 * @file layout.js
 * @description Next.js App Router Root Layout with AuthProvider, RTL support, and Cairo font.
 */
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "SkillBridge 2.0 - منصة التأهيل الأكاديمي والعمل الحر",
  description: "منصة التأهيل الأكاديمي والعمل الحر للطلاب الجامعيين والخريجين",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-['Cairo']">
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
