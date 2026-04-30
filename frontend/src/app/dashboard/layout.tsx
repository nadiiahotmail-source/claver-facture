import Sidebar from "@/components/Sidebar";
import MobileTabBar from "@/components/MobileTabBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 ml-0 lg:ml-72 min-h-screen relative pb-20 lg:pb-0 pt-[env(safe-area-inset-top)]">
        {children}
      </main>
      <MobileTabBar />
    </div>
  );
}
