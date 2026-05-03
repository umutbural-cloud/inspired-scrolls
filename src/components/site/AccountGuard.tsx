import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SiteLayout } from "./SiteLayout";
import { seedDemoData } from "@/lib/seedDemo";

export const AccountGuard = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();
  useEffect(() => {
    if (session?.user?.id) {
      seedDemoData(session.user.id);
    }
  }, [session?.user?.id]);
  if (loading) {
    return (
      <SiteLayout>
        <div className="content-column px-6 py-32 flex justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </SiteLayout>
    );
  }
  if (!session) return <Navigate to="/giris" replace />;
  return <>{children}</>;
};