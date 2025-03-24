import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useAtom, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "~/components/common/PageHeader";
import { ActivityForm } from "~/components/forms/ActivityForm";
import { DataTable } from "~/components/tables/DataTable";
import { ActivityColumn } from "~/components/tables/columns/ActivityColumn";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { activitiesAtom, fetchActivitiesAtom } from "~/jotai/activitiesAtom";
import { cropsAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import type { ActivityData, CropData } from "~/types/types";

export const loader: LoaderFunction = async ({ request }) => {
  const cropsUrl = API.EXTERNAL + ENDPOINTS.CROPS;
  const activitiesUrl = API.EXTERNAL + ENDPOINTS.ACTIVITIES;

  try {
    const [cropResponse, activitiesResponse] = await Promise.all([
      fetch(cropsUrl, {
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
          // "Authorization": `Bearer ${getAuthToken(request)}`
        },
      }),
      fetch(activitiesUrl, {
        headers: {
          "Content-Type": "application/json",
          // Add authorization if needed
        },
      }),
    ]);

    if (!cropResponse.ok || !activitiesResponse.ok) {
      throw new Error(
        `Failed to fetch data: ${cropResponse.status} ${activitiesResponse.status}`
      );
    }

    const [crops, activities] = await Promise.all([
      cropResponse.json(),
      activitiesResponse.json(),
    ]);

    return { crops, activities };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load activities data", { status: 500 });
  }
};

export default function Activities() {
  const { crops, activities } = useLoaderData<{
    crops: CropData[];
    activities: ActivityData[];
  }>();
  const handleOpen = useSetAtom(openForm);
  const [activitiesData, setActivityData] = useAtom(activitiesAtom);
  const [cropData, setCrops] = useAtom(cropsAtom);
  const refreshActivities = useSetAtom(fetchActivitiesAtom);
  const refreshCrops = useSetAtom(fetchCropsAtom);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize atoms with loader data
  useEffect(() => {
    setActivityData(activities);
    setCrops(crops);
  }, [setActivityData, activities, setCrops, crops]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshActivities(), refreshCrops()]);
      toast({
        title: "Success",
        description: "Data refreshed successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
      console.error("Refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Activities"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Data"
              )}
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleOpen}
            >
              Add Activity
            </Button>
          </div>
        }
      />

      <ActivityForm crops={cropData} />

      <div className="container mx-auto py-4">
        {activitiesData && activitiesData.length > 0 ? (
          <DataTable
            columns={ActivityColumn}
            data={activitiesData}
            filterColumn="description"      
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No activities found</p>
            <Button onClick={handleOpen} className="bg-green-700 text-white">
              Create your first activity
            </Button>
          </div>
        )}
      </div>
    </>
  );
}