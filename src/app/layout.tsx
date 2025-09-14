import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
