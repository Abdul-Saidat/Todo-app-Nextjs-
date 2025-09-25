import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "Simple Todo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body
        className={`${montserrat.variable} antialiased bg-slate-100 text-slate-500`}
      >
        <ClientLayout> {children} </ClientLayout>
      </body>
    </html>
  );
}
