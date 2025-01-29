import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sun, ShoppingBag, BookOpen } from "lucide-react";

export function Navigation() {
  return (
    <div className="w-full border-b bg-gradient-to-r from-ibiza-sand to-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="flex items-center space-x-2 font-bold text-ibiza-night">
                <Sun className="h-6 w-6 text-ibiza-azure" />
                <span>Ibiza Genie</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
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
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/shop"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-ibiza-sand/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-ibiza-sand/40 hover:text-ibiza-night focus:bg-ibiza-sand/40 focus:text-ibiza-night focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Shop
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/blog"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-ibiza-sand/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-ibiza-sand/40 hover:text-ibiza-night focus:bg-ibiza-sand/40 focus:text-ibiza-night focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Blog
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}