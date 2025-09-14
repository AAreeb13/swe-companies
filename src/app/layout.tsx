import type { Metadata } from "next";
import "./globals.css";
import { CompaniesProvider } from "@/context/CompaniesContext";

export const metadata: Metadata = {
  title: "SWE Companies Tracker",
  description: "Track your software engineering job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CompaniesProvider>
          {children}
        </CompaniesProvider>
      </body>
    </html>
  );
}
