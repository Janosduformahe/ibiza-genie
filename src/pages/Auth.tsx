
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";

const Auth = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to home if already logged in
  if (!isLoading && user) {
    return <Navigate to="/" />;
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message || "An error occurred during sign up",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "An error occurred during sign in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#33C3F0] to-[#0FA0CE]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-md bg-white/20 border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">Accede a tu cuenta</CardTitle>
              <CardDescription className="text-white/90">
                Inicia sesión o crea una cuenta para guardar tus chats
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/20 px-2 text-white">
                      Continúa con email
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">Iniciar sesión</TabsTrigger>
                    <TabsTrigger value="register" className="text-white data-[state=active]:bg-white/20">Registrarse</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          id="email"
                          placeholder="Email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/30 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          id="password"
                          placeholder="Contraseña"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/30 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white/30 hover:bg-white/40 text-white border border-white/30"
                        disabled={loading}
                      >
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <form onSubmit={handleEmailSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          id="register-email"
                          placeholder="Email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-white/30 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          id="register-password"
                          placeholder="Contraseña"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-white/30 border-white/30 text-white placeholder:text-white/60"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-white/30 hover:bg-white/40 text-white border border-white/30"
                        disabled={loading}
                      >
                        {loading ? "Registrando..." : "Registrarse"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
