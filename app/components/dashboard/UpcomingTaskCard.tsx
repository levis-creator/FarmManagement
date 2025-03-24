import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface Task {
  id: number;
  crop: string;
  task: string;
  date: string;
  priority?: "low" | "medium" | "high";
}

interface UpcomingTasksCardProps {
  data: Task[];
  isMobile: boolean;
}

export function UpcomingTasksCard({ data, isMobile }: UpcomingTasksCardProps) {
  const formatDate = (dateString: string) => {
    if (isMobile) {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-green-100 h-full">
      <CardHeader>
        <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
          <span className="text-green-800">Upcoming Tasks</span>
          {!isMobile && (
            <span className="ml-2 text-sm font-normal text-green-600">
              ({data.length} pending)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, isMobile ? 3 : data.length).map((task) => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Checkbox 
                  className="border-green-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!isMobile && task.priority === "high" && (
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                    <p className={`${isMobile ? "text-sm" : "text-base"} font-medium text-green-800 truncate`}>
                      {task.task}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <p className={`${isMobile ? "text-xs" : "text-sm"} text-green-600 truncate`}>
                      {task.crop} • Due: {formatDate(task.date)}
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "sm"} 
                className="text-green-600 hover:text-green-800 hover:bg-green-100 flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {isMobile && data.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-green-600 hover:text-green-800"
          >
            View All ({data.length})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}