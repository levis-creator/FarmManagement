import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  compact?: boolean;
}

export function DashboardStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  compact = false 
}: StatCardProps) {
  return (
    <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-green-700`}>
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-green-800`}>
          {value}
        </div>
        <p className={`${compact ? 'text-xs' : 'text-sm'} text-green-600 mt-1`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}