import type { Metadata } from "next";
import "./globals.css";
import { FlowProvider } from "@/components/flow-provider";
export const metadata: Metadata = { title: "Parivahan Path | Prototype", description: "Citizen-centric vehicle services prototype" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><FlowProvider>{children}</FlowProvider></body></html>; }
