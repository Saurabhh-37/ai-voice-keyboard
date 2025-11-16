import Sidebar from "@/components/Sidebar";
import Appbar from "@/components/Appbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        
        {/* Main content area with appbar */}
        <div className="flex-1 flex flex-col">
          <Appbar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

