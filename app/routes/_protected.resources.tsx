import { useSetAtom } from "jotai"
import { PageHeader } from "~/components/common/PageHeader"
import { ResourceForm } from "~/components/forms/ResourceForm"
import { Button } from "~/components/ui/button"
import { openForm } from "~/jotai/uiAtoms"

const Resources = () => {
  const handleOpen = useSetAtom(openForm)
  const crops = [
    { _id: "1", name: "Crop 1" },
    { _id: "2", name: "Crop 2" },
    { _id: "3", name: "Crop 3" },
  ];
  return (
    <>
      <PageHeader title="Resources" actions={
        <>
          <Button className='bg-green-700 text-white' onClick={handleOpen}>
            Add
          </Button>
        </>

      } />
      <ResourceForm crops={crops} />
      Resources</>
  )
}

export default Resources