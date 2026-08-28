import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FlowProvider } from "@/components/flow-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = { title: "Parivahan Path | Prototype", description: "Citizen-centric vehicle services prototype" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <FlowProvider>{children}</FlowProvider>
      </body>
    </html>
  );
}
