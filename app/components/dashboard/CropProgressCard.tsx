import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

interface CropProgressCardProps {
  data: {
    name: string;
    progress: number;
    status: string;
  }[];
  isMobile: boolean;
}

export function CropProgressCard({ data, isMobile }: CropProgressCardProps) {
  return (
    <Card className="border-green-100 h-full">
      <CardHeader>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-green-800`}>
          Crop Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((crop) => (
            <div key={crop.name} className="group">
              <div className="flex justify-between mb-1">
                <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-green-700`}>
                  {crop.name}
                </span>
                <span className={`${isMobile ? 'text-xs' : 'text-sm'} ${
                  crop.status === "Ready for Harvest" 
                    ? "text-green-600 font-semibold" 
                    : "text-green-500"
                }`}>
                  {crop.status}
                </span>
              </div>
              <Progress 
                value={crop.progress} 
                className="h-2 bg-green-100"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}