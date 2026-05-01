"use client"

import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import OutOfStockOverlay from "@/components/shared/OutOfStockOverlay";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{
    out_of_stock_enabled: boolean;
    restock_timer: string | null;
  } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSiteSettings(data);
      } catch (err) {
        console.error("Failed to fetch site settings", err);
      }
    };
    fetchSettings();
  }, []);

  const isLandingPage = pathname === '/';
  const hideNavbar = isMobile && isLandingPage;

  return (
    <div className="w-full min-h-screen bg-[#050810] flex flex-col">
      {siteSettings?.out_of_stock_enabled && (
        <OutOfStockOverlay restockTime={siteSettings.restock_timer} />
      )}
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
