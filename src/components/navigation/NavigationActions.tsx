
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/LanguageSelector";

export function NavigationActions() {
  const { t } = useLanguage();

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button asChild variant="ghost" size="icon" className="text-ibiza-night hover:bg-ibiza-sand/50">
        <Link to="/shop" aria-label={t('common.shop')}>
          <ShoppingBag className="h-5 w-5" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="text-ibiza-night hover:bg-ibiza-sand/50">
        <Link to="/calendar" aria-label={t('common.calendar')}>
          <CalendarDays className="h-5 w-5" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" className="text-ibiza-night hover:bg-ibiza-sand/50">
        <Link to="/chat" aria-label={t('common.chat')}>
          <MessageSquare className="h-5 w-5" />
        </Link>
      </Button>
      
      <LanguageSelector />
    </div>
  );
}
