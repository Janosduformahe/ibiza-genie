
import { Link } from "react-router-dom";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sun, ShoppingBag, BookOpen, CalendarDays } from "lucide-react";

export const NavigationExploreMenu = () => (
  <NavigationMenuItem>
    <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid gap-3 p-4 md:p-6 w-screen md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
        <li className="row-span-3">
          <NavigationMenuLink asChild>
            <Link
              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-ibiza-azure/10 to-ibiza-azure/20 p-6 no-underline outline-none focus:shadow-md"
              to="/"
            >
              <Sun className="h-6 w-6 text-ibiza-azure" />
              <div className="mb-2 mt-4 text-lg font-medium text-ibiza-night">
                Ibiza AI Guide
              </div>
              <p className="text-sm leading-tight text-muted-foreground">
                Your personal AI assistant for discovering Ibiza's best experiences
              </p>
            </Link>
          </NavigationMenuLink>
        </li>
        <li>
          <NavigationMenuLink asChild>
            <Link
              to="/shop"
              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ibiza-sand/50 hover:text-ibiza-night focus:bg-ibiza-sand/50 focus:text-ibiza-night"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <div className="text-sm font-medium leading-none">Shop</div>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                Browse our curated collection of Ibiza merchandise
              </p>
            </Link>
          </NavigationMenuLink>
        </li>
        <li>
          <NavigationMenuLink asChild>
            <Link
              to="/blog"
              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ibiza-sand/50 hover:text-ibiza-night focus:bg-ibiza-sand/50 focus:text-ibiza-night"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <div className="text-sm font-medium leading-none">Blog</div>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                Discover insider tips and stories about Ibiza
              </p>
            </Link>
          </NavigationMenuLink>
        </li>
        <li>
          <NavigationMenuLink asChild>
            <Link
              to="/calendar"
              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-ibiza-sand/50 hover:text-ibiza-night focus:bg-ibiza-sand/50 focus:text-ibiza-night"
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <div className="text-sm font-medium leading-none">Party Calendar</div>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                Find the hottest parties and events in Ibiza
              </p>
            </Link>
          </NavigationMenuLink>
        </li>
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
);
