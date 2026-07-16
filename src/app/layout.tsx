import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "gameColector",
  description: "Gestión de colección de videojuegos retro",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <html lang="es">
      <body className="bg-background text-on-surface min-h-screen flex antialiased">
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <Sidebar user={user} />
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          <TopBar user={user} />
          <main className="flex-1 pt-16 px-container-padding-mobile md:px-container-padding-desktop pb-stack-lg">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
