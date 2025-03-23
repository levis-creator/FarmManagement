import { useSetAtom } from 'jotai'
import { PageHeader } from '~/components/common/PageHeader'
import { ActivityForm } from '~/components/forms/ActivityForm'
import { Button } from '~/components/ui/button'
import { openForm } from '~/jotai/uiAtoms'

const Activities = () => {
  const handleOpen = useSetAtom(openForm)
  const crops = [
    { _id: "1", name: "Crop 1" },
    { _id: "2", name: "Crop 2" },
    { _id: "3", name: "Crop 3" },
  ];

  return (
    <>
      <PageHeader title="Activities" actions={
        <>
          <Button className='bg-green-700 text-white' onClick={handleOpen}>
            Add
          </Button>
        </>

      } />
      <ActivityForm crops={crops}/>
      Activities</>
  )
}

export default Activities