import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth"
import { Providers } from "@/components/layout/providers";
import { headers } from "next/headers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yusmery e-Solutions",
  description: "Plataforma de capacitación empresarial",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers()
  const currentUrl = headersList.get('x-url') || ""
  const isTeacher = currentUrl.includes('/teacher')
  const isSuperAdmin = currentUrl.includes('/super-admin')
  const isAdmin = currentUrl.includes('/admin') && !isSuperAdmin

  let session = await auth()
  
  // BYPASS: If no session, provide a Guest session corresponding to the current section
  // This prevents the middleware from redirecting guest users back to /dashboard
  if (!session) {
    let role = "STUDENT"
    let email = "colaborador@empresa.com"
    let name = "Invitado Colaborador"

    if (isSuperAdmin) {
      role = "SUPER_ADMIN"
      email = "admin@esolutions.com"
      name = "Invitado Admin"
    } else if (isAdmin) {
      role = "ADMINISTRADOR"
      email = "admin@esolutions.com"
      name = "Invitado Admin"
    } else if (isTeacher) {
      role = "PROFESOR"
      email = "profe@empresa.com"
      name = "Invitado Profesor"
    }

    session = {
      user: {
        id: "guest-id",
        name,
        email,
        role: role as any
      },
      expires: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
