import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/app/auth/AuthProvider";
import GlobalSessionManager from "@/app/auth/GlobalSessionManager";

import CartDrawer from "@/components/CartDrawer";

import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_LOGO,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: "%s | Inventta 3D",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "impressão 3D",
    "impressão 3D personalizada",
    "geek",
    "RPG",
    "miniaturas",
    "decoração",
    "chaveiros",
    "presentes personalizados",
    "Aquidauana",
    "Mato Grosso do Sul",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_LOGO, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_LOGO],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <CartProvider>
            
            <GlobalSessionManager />

            {children}

            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}