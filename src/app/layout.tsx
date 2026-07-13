import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gameColector",
  description: "Gestión de colección de videojuegos retro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
