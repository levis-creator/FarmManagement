import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { CropProgressCard } from "~/components/dashboard/CropProgressCard";
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "~/components/dashboard/DashboardStatsCard";
import { RecentActivitiesCard } from "~/components/dashboard/RecentActivitiesCard";
import { UpcomingTasksCard } from "~/components/dashboard/UpcomingTaskCard";
import { useMediaQuery } from "~/hooks/use-media-query";
import { fetchActivitiesAtom } from "~/jotai/activitiesAtom";
import { fetchCropsAtom } from "~/jotai/cropsAtom";
import { statsAtom } from "~/jotai/statsAtom";

export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const fetchCrops=useSetAtom(fetchCropsAtom)
  const fetchActivities=useSetAtom(fetchActivitiesAtom)
  const stats=useAtomValue(statsAtom)
  useEffect(()=>{
    fetchCrops()
    fetchActivities()
  },[fetchCrops, fetchActivities])
  // Mock data
  console.log(stats)

  const cropProgress = [
    { name: "Tomatoes", progress: 75, status: "Growing" },
    { name: "Wheat", progress: 50, status: "Growing" },
    { name: "Corn", progress: 90, status: "Ready for Harvest" },
  ];

  const upcomingTasks = [
    { id: 1, crop: "Tomatoes", task: "Fertilization", date: "2025-03-20" },
    { id: 2, crop: "Wheat", task: "Irrigation", date: "2025-03-21" },
    { id: 3, crop: "Corn", task: "Pest Control", date: "2025-03-22" },
  ];

  const recentActivities = [
    { id: 1, description: "Planted tomatoes", date: "2025-03-15", crop: "Tomatoes" },
    { id: 2, description: "Applied fertilizer", date: "2025-03-16", crop: "Wheat" },
    { id: 3, description: "Watered corn field", date: "2025-03-17", crop: "Corn" },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <DashboardHeader isMobile={isMobile} />
      
      {/* Stats Grid - Responsive Columns */}
      <div className={`grid gap-4 mb-8 ${
        isMobile ? "grid-cols-1" : 
        isTablet ? "grid-cols-2" : 
        "grid-cols-4"
      }`}>
        {stats.map((stat, index) => (
          <DashboardStatsCard 
            key={index} 
            {...stat} 
            compact={isMobile}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`grid gap-4 ${
        isMobile ? "grid-cols-1" : 
        "grid-cols-1 lg:grid-cols-7"
      }`}>
        {/* Crop Progress - Full width on mobile, 4 cols on desktop */}
        <div className={isMobile ? "" : "lg:col-span-4"}>
          <CropProgressCard 
            data={cropProgress} 
            isMobile={isMobile}
          />
        </div>
        
        {/* Upcoming Tasks - Full width on mobile, 3 cols on desktop */}
        <div className={isMobile ? "mt-4" : "lg:col-span-3"}>
          <UpcomingTasksCard 
            data={upcomingTasks} 
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Recent Activities - Always full width */}
      <div className="mt-4">
        <RecentActivitiesCard 
          data={recentActivities} 
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}