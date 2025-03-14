
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface EmailSignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const EmailSignUpForm = ({ email, setEmail, password, setPassword }: EmailSignUpFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
};
