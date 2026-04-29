"use client"

import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isLandingPage = pathname === '/';
  const hideNavbar = isMobile && isLandingPage;

  return (
    <div className="w-full min-h-screen bg-[#050810] flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-grow mobile-bottom-padding",
        !hideNavbar ? "pt-[72px]" : "pt-0",
        "md:pt-0" // Reset on desktop if navbar overlaps
      )}>
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
