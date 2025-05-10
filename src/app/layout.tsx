import Head from 'next/head';
import type { Metadata } from 'next';
import './globals.css';
import './video-react.css';
import Header from '@/components/header/Header';
// import Footer from '@/components/home/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/main.css';
import { Toaster } from "@/components/ui/sonner"
import logo from '/public/logo.png'
import { getSeoData } from '@/lib/getSeoData';

// ✅ Fetch metadata dynamically from the API
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ahmed Elsayed",
    description: "Ahmed Abdullaj",
    keywords: "SCADA, SIRI ASSESSMENT",
   
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" id="root">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body className="w-full" suppressHydrationWarning={true}>
        <Header />
        {children}
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
