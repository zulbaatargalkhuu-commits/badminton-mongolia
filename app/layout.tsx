import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MBA Badminton Portal",
  description: "Tournament operations and club extranet for the Mongolian Badminton Association.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
