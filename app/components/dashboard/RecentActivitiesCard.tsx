import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { MoreVertical, Clock, CheckCircle } from "lucide-react";

interface Activity {
  id: number;
  description: string;
  date: string;
  crop: string;
  status?: "completed" | "pending";
}

interface RecentActivitiesCardProps {
  data: Activity[];
  isMobile: boolean;
}

export function RecentActivitiesCard({ data, isMobile }: RecentActivitiesCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (isMobile) {
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return `${diffDays}d ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
          <span className="text-green-800">Recent Activities</span>
          {!isMobile && (
            <span className="ml-2 text-sm font-normal text-green-600">
              (Last {data.length} activities)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, isMobile ? 3 : data.length).map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {activity.status === "completed" ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={`${isMobile ? "text-sm" : "text-base"} font-medium text-green-800 truncate`}>
                    {activity.description}
                  </p>
                  <p className={`${isMobile ? "text-xs" : "text-sm"} text-green-600 truncate`}>
                    {activity.crop} • {formatDate(activity.date)}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size={isMobile ? "icon" : "sm"} 
                className="text-green-600 hover:text-green-800 hover:bg-green-100 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
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
            Show More Activities
          </Button>
        )}
      </CardContent>
    </Card>
  );
}