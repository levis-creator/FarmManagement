import { Button } from "~/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface DashboardHeaderProps {
  isMobile: boolean;
}

export function DashboardHeader({ isMobile }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
        Farm Dashboard
      </h1>
      
      <div className="flex flex-col xs:flex-row gap-2">
        <Button 
          variant="outline" 
          className="border-green-600 text-green-800 hover:bg-green-50"
          size={isMobile ? "sm" : "default"}
        >
          <Calendar className="mr-2 h-4 w-4 text-green-600" />
          {isMobile ? "Calendar" : "Calendar View"}
        </Button>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isMobile ? "Add" : "Add Activity"}
        </Button>
      </div>
    </div>
  );
}