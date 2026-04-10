"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token && !isLoginPage) {
      router.push('/login');
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, [pathname, router, isLoginPage]);

  // Evitar parpadeo de contenido mientras verificamos auth
  if (isAuth === null && !isLoginPage) {
    return (
      <html lang="en" data-theme="luigi">
        <body className={inter.className}>
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <span className="loading loading-infinity loading-lg text-primary"></span>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" data-theme="luigi">
      <body className={`${inter.className} bg-base-200/50 min-h-screen transition-colors duration-500`}>
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
      </body>
    </html>
  );
}
