import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: "Little Dubai UAE | The World's Largest Shoe Destination",
  description: "Shop the latest luxury shoes, bags, and accessories from Nike, Louis Vuitton, Gucci, and more at Little Dubai UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Header />
          <main>
            {children}
          </main>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
