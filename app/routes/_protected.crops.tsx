import { useSetAtom } from "jotai"
import { PageHeader } from "~/components/common/PageHeader"
import CropsForm from "~/components/forms/CropsForm"
import { Button } from "~/components/ui/button"
import { openForm } from "~/jotai/uiAtoms"

const Crops = () => {
  const handleOpen = useSetAtom(openForm)
  return (
    <>
      <PageHeader title="Crops" actions={
        <>
          <Button className='bg-green-700 text-white' onClick={handleOpen}>
            Add
          </Button>
        </>

      } />
      <CropsForm />
      Crops</>
  )
}

export default Crops