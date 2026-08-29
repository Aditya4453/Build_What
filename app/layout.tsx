import type { Metadata } from "next";
import "ux4g-web-components/styles.css";
import "./globals.css";
import { FlowProvider } from "@/components/flow-provider";

export const metadata: Metadata = {
  title: "Parivahan Path | UX4G Citizen Transport Services",
  description: "Citizen-centric vehicle services prototype adhering to UX4G Design System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <FlowProvider>{children}</FlowProvider>
      </body>
    </html>
  );
}

