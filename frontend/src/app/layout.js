import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "../context/CartContext";
import { OrderProvider } from "../context/OrderContext";
import { AuthProvider } from "../context/AuthContext";
import { WishlistProvider } from "../context/WishlistContext";
import { ToastProvider } from "../context/ToastContext";
import { AIProvider } from "../context/AIContext";
import Toast from "@/components/ui/Toast";
import Assistant from "@/components/AIAssistant/Assistant";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

export const metadata = {
    title: "CITY CENTER | Онлайн-супермаркет",
    description: "Свежие продукты, быстрый заказ и удобная доставка по Казахстану.",
    keywords: "супермаркет, продукты, алматы, доставка еды, онлайн магазин",
    openGraph: {
        title: "CITY CENTER | Онлайн-супермаркет",
        description: "Свежие продукты, быстрый заказ и удобная доставка по Казахстану.",
        type: "website",
        locale: "ru_RU",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={`${inter.variable} ${manrope.variable} antialiased`}>
                <AuthProvider>
                    <CartProvider>
                        <OrderProvider>
                            <AIProvider>
                                <WishlistProvider>
                                    <ToastProvider>
                                        <Navbar />
                                        <main className="min-h-screen pt-20">{children}</main>
                                        <Footer />
                                        <Toast />
                                        <Assistant />
                                    </ToastProvider>
                                </WishlistProvider>
                            </AIProvider>
                        </OrderProvider>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
