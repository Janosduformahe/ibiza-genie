
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailSignInForm } from "./EmailSignInForm";
import { EmailSignUpForm } from "./EmailSignUpForm";

export const AuthCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
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
              <EmailSignInForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <EmailSignUpForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
