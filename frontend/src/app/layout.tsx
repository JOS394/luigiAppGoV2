"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="es" data-theme="luigi">
      <body className={`${inter.className} bg-base-200/50 min-h-screen transition-colors duration-500`}>
        <AuthProvider>
          {isLoginPage ? (
            <main>{children}</main>
          ) : (
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-grow overflow-x-hidden p-4 sm:p-6 md:p-8">
                  <div className="max-w-[1600px] mx-auto w-full h-full">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          )}
          <Toaster position="top-right" expand={true} richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
