import { Link } from "react-router-dom";
import { Sun } from "lucide-react";

export const NavigationLogo = () => (
  <Link to="/" className="flex items-center space-x-2 font-bold text-ibiza-night">
    <Sun className="h-6 w-6 text-ibiza-azure" />
    <span>Ibiza Genie</span>
  </Link>
);