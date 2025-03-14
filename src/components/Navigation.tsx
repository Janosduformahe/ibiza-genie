import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavigationActions } from "@/components/navigation/NavigationActions";
import { NavigationLogo } from "@/components/navigation/NavigationLogo";
import { NavigationExploreMenu } from "@/components/navigation/NavigationExploreMenu";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle2, LogOut } from "lucide-react";

export function Navigation() {
  const { t } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { href: "/", label: t('navigation.home') },
    { href: "/calendar", label: t('navigation.calendar') },
    { href: "/chat", label: t('navigation.chat') },
    { href: "/blog", label: t('navigation.blog') },
    { href: "/shop", label: t('navigation.shop') },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg border-b border-white/10 bg-black/20">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <NavigationLogo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-white",
                  isActive(item.href)
                    ? "text-white"
                    : "text-white/70"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <NavigationExploreMenu />
          
          {/* Auth buttons */}
          {user ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <UserCircle2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('auth.profile')}</DialogTitle>
                  <DialogDescription>
                    {t('auth.loggedInAs')} {user.email}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    {t('auth.signOut')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/auth">{t('auth.signIn')}</Link>
            </Button>
          )}
          
          <NavigationActions />
        </div>
      </div>
    </header>
  );
}
