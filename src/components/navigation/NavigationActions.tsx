
import { Link } from "react-router-dom";
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { ShoppingBag, BookOpen, CalendarDays } from "lucide-react";

export const NavigationActions = () => {
  return (
    <>
      <NavigationMenuItem>
        <Link
          to="/blog"
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-ibiza-azure/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-ibiza-azure/40 hover:text-ibiza-night focus:bg-ibiza-azure/40 focus:text-ibiza-night focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Blog
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link
          to="/calendar"
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-ibiza-azure/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-ibiza-azure/40 hover:text-ibiza-night focus:bg-ibiza-azure/40 focus:text-ibiza-night focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          Party Calendar
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link
          to="/shop"
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-ibiza-azure/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-ibiza-azure/40 hover:text-ibiza-night focus:bg-ibiza-azure/40 focus:text-ibiza-night focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Shop
        </Link>
      </NavigationMenuItem>
    </>
  );
};
