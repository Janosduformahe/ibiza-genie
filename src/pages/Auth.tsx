
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthCard } from "@/components/auth/AuthCard";

const Auth = () => {
  const { user, isLoading } = useAuth();

  // Redirect to home if already logged in
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <AuthCard />
        </div>
      </div>
    </div>
  );
};

export default Auth;
