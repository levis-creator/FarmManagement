import { Menu } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { useSidebar } from '~/components/ui/sidebar';

const TopBar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-white py-3 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          className="text-green-800 hover:bg-green-50 rounded-lg p-2 transition-colors duration-200"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-semibold">Welcome, User!</span>
          {/* Add additional top bar elements here (e.g., notifications, profile dropdown) */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;