import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Sayanth Krishna | Portfolio",
  description: "Personal Portfolio based on the iconic Tomasz Gajda design template, featuring full admin editing capabilities.",
  icons: {
    icon: "/assets/template/ic_baseline-double-arrow.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark scroll-smooth ${montserrat.variable}`}>
      <body className="bg-[#000000] text-[#FFFFFF] font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
