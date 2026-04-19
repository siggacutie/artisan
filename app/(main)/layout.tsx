import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { TawkToWidget } from '@/components/providers/TawkToWidget'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-[#050810] flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <MobileBottomNav />
      <TawkToWidget />
    </div>
  );
}
