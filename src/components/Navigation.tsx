import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationLogo } from "./navigation/NavigationLogo";
import { NavigationExploreMenu } from "./navigation/NavigationExploreMenu";
import { NavigationActions } from "./navigation/NavigationActions";

export function Navigation() {
  return (
    <div className="w-full border-b bg-gradient-to-r from-ibiza-sand to-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationLogo />
            <NavigationExploreMenu />
            <NavigationActions />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}