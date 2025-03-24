import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useSetAtom } from "jotai";
import { PageHeader } from "~/components/common/PageHeader";
import { ActivityForm } from "~/components/forms/ActivityForm";
import { DataTable } from "~/components/tables/DataTable";
import { ActivityColumn } from "~/components/tables/columns/ActivityColumn";
import { Button } from "~/components/ui/button";
import { openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import type { ActivityData, CropData } from "~/types/types";

// Define the loader function to fetch data
export const loader: LoaderFunction = async () => {
  const cropsUrl = API.EXTERNAL + ENDPOINTS.CROPS;
  const activitiesUrl = API.EXTERNAL + ENDPOINTS.ACTIVITIES;

  try {
    // Fetch crops and activities in parallel
    const [cropResponse, activitiesResponse] = await Promise.all([
      fetch(cropsUrl),
      fetch(activitiesUrl),
    ]);

    // Check if both responses are OK
    if (!cropResponse.ok || !activitiesResponse.ok) {
      throw new Error("Failed to fetch data");
    }

    // Parse the JSON data
    const crops = await cropResponse.json();
    const activities = await activitiesResponse.json();

    // Return the data as JSON
    return { crops, activities };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Response("Failed to fetch data", { status: 500 });
  }
};

export default function Activities() {
  const { crops, activities } = useLoaderData<{ crops: CropData[]; activities: ActivityData[] }>();
  const handleOpen = useSetAtom(openForm);
  console.log(activities)


  return (
    <>
      <PageHeader
        title="Activities"
        actions={
          <Button className="bg-green-700 text-white" onClick={handleOpen}>
            Add Activity
          </Button>
        }
      />

      {/* Render the ActivityForm */}
      <ActivityForm crops={crops} />

      {/* Display the activities data in a table */}
      <div className="container mx-auto py-4">
        <DataTable columns={ActivityColumn} data={activities} filterColumn="description" />
      </div>
    </>
  );
}