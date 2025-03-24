import { useLoaderData } from "@remix-run/react"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { PageHeader } from "~/components/common/PageHeader"
import CropsForm from "~/components/forms/CropsForm"
import { CropColumn } from "~/components/tables/columns/CropColumn"
import { DataTable } from "~/components/tables/DataTable"
import { Button } from "~/components/ui/button"
import { cropsAtom } from "~/jotai/cropsAtom"
import { openForm } from "~/jotai/uiAtoms"
import { API, ENDPOINTS } from "~/lib/ApiUrl"

// Loader function to fetch crops data
export async function loader() {
  const url = API.EXTERNAL + ENDPOINTS.CROPS
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("Failed to fetch crops data")
  }
  const results = await res.json()
  return Response.json(results)
}

const Crops = () => {
  const handleOpen = useSetAtom(openForm)
  const [crops, setCrops] = useAtom(cropsAtom)
  const data = useLoaderData<typeof loader>()

  // Update the cropsAtom with the fetched data
  useEffect(() => {
    setCrops(data)
  }, [data, setCrops])
  
  return (
    <>
      <PageHeader
        title="Crops"
        actions={
          <Button className="bg-green-700 text-white" onClick={handleOpen}>
            Add Crop
          </Button>
        }
      />

      {/* Display the crops data in a table */}
      <div className="container mx-auto py-4">
        <DataTable columns={CropColumn} data={crops} filterColumn="name" />
      </div>

      {/* Render the CropsForm */}
      <CropsForm />
    </>
  )
}

export default Crops