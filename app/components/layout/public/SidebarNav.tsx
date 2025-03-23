import { Link } from "react-router-dom"; // or use next/link if using Next.js
import { Home, Users, Settings, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";

export function SidebarNav() {
  return (
    <nav className="mt-6">
      <ul className="space-y-2">
        <li>
          <Link
            to="/"
            className="flex items-center p-2 hover:bg-green-100 rounded text-green-800"
          >
            <Home className="w-5 h-5 mr-2 text-green-800" />
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/users"
            className="flex items-center p-2 hover:bg-green-100 rounded text-green-800"
          >
            <Users className="w-5 h-5 mr-2 text-green-800" />
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex items-center p-2 hover:bg-green-100 rounded text-green-800"
          >
            <Settings className="w-5 h-5 mr-2 text-green-800" />
            Settings
          </Link>
        </li>
        <li>
          <Button
            variant="ghost"
            className="w-full justify-start text-green-800 hover:bg-green-100"
          >
            <LogOut className="w-5 h-5 mr-2 text-green-800" />
            Logout
          </Button>
        </li>
      </ul>
    </nav>
  );
}