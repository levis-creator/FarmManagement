import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useAtom, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "~/components/common/PageHeader";
import { ResourceForm } from "~/components/forms/ResourceForm";
import { DataTable } from "~/components/tables/DataTable";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import { cropsAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { fetchResourcesAtom, resourcesAtom } from "~/jotai/resourcesAtom";
import { openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { ResourceColumns } from '~/components/tables/columns/ResourceColumn';
import { DbResponse, CropData, ResourceData } from '../types/types';

export const loader: LoaderFunction = async () => {
  const cropsUrl = API.EXTERNAL + ENDPOINTS.CROPS;
  const resourcesUrl = API.EXTERNAL + ENDPOINTS.RESOURCES;

  try {
    const [cropResponse, resourcesResponse] = await Promise.all([
      fetch(cropsUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch(resourcesUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    if (!cropResponse.ok || !resourcesResponse.ok) {
      throw new Error(
        `Failed to fetch data: ${cropResponse.status} ${resourcesResponse.status}`
      );
    }

    const [crops, resources] = await Promise.all([
      cropResponse.json(),
      resourcesResponse.json(),
    ]);

    return { crops, resources };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load resources data", { status: 500 });
  }
};

export default function Resources() {
  const { crops, resources } = useLoaderData<{
    crops: DbResponse<CropData>;
    resources: DbResponse<ResourceData>;
  }>();
  const handleOpen = useSetAtom(openForm);
  const [resourcesData, setResourceData] = useAtom(resourcesAtom);
  const [cropData, setCrops] = useAtom(cropsAtom);
  const refreshResources = useSetAtom(fetchResourcesAtom);
  const refreshCrops = useSetAtom(fetchCropsAtom);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize atoms with loader data
  useEffect(() => {
    setResourceData(resources.data as ResourceData[]);
    setCrops(crops.data as CropData[]);
  }, [setResourceData, resources, setCrops, crops]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshResources(), refreshCrops()]);
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
        title="Resources"
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
              Add Resource
            </Button>
          </div>
        }
      />

      <ResourceForm crops={cropData} />

      <div className="container mx-auto py-4">
        {resourcesData && resourcesData.length > 0 ? (
          <DataTable
            columns={ResourceColumns}
            data={resourcesData}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No resources found</p>
            <Button onClick={handleOpen} className="bg-green-700 text-white">
              Create your first resource
            </Button>
          </div>
        )}
      </div>
    </>
  );
}