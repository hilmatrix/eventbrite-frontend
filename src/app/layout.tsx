import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eventrix",
  description: "Event finder by Hilman and Norman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">{children}</main>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
