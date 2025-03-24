import { useLoaderData } from "@remix-run/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { PageHeader } from "~/components/common/PageHeader";
import { CropColumn } from "~/components/tables/columns/CropColumn";
import { DataTable } from "~/components/tables/DataTable";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { cropsAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import type { LoaderFunction } from "@remix-run/node";
import { toast } from "~/hooks/use-toast";
import CropsForm from "~/components/forms/CropsForm";

export const loader: LoaderFunction = async () => {
  const url = API.EXTERNAL + ENDPOINTS.CROPS;
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // Add authorization if needed
        // "Authorization": `Bearer ${getAuthToken(request)}`
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch crops: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load crops data", { status: 500 });
  }
};

export default function Crops() {
  const handleOpen = useSetAtom(openForm);
  const [crops, setCrops] = useAtom(cropsAtom);
  const refreshCrops = useSetAtom(fetchCropsAtom);
  const data = useLoaderData<typeof loader>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize crops atom with loader data
  useEffect(() => {
    if (data) {
      setCrops(data);
    }
  }, [data, setCrops]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCrops();
      toast({
        title: "Success",
        description: "Crops data refreshed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh crops",
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
        title="Crops"
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
              Add Crop
            </Button>
          </div>
        }
      />

      <div className="container mx-auto py-4">
        {crops && crops.length > 0 ? (
          <DataTable
            columns={CropColumn}
            data={crops}
            filterColumn="name"

          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No crops found</p>
            <Button onClick={handleOpen} className="bg-green-700 text-white">
              Add your first crop
            </Button>
          </div>
        )}
      </div>

      <CropsForm />
    </>
  );
}