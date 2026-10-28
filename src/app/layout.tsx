import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/app/auth/AuthProvider";
import GlobalSessionManager from "@/app/auth/GlobalSessionManager";

import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Inventta 3D",
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