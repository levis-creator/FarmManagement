import { ColumnDef } from "@tanstack/react-table";
import { useSetAtom } from "jotai";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DeleteDialog } from "~/components/common/DeleteDialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { activityAtom, fetchActivitiesAtom } from "~/jotai/activitiesAtom";
import { editForm, openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { ActivityFormData } from "~/schemas/ActivitySchema";
import { ActivityData, CropData } from "~/types/types";

// Define the columns for the table
export const ActivityColumn: ColumnDef<ActivityFormData>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "cropId",
    header: "Crop Name",
    cell: ({ row }) => {
      const crop: CropData = row.getValue("cropId")
      return (
        <div>{crop?crop.name:"N/A"}</div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const activity = row.original;
      return <Actions activity={activity} />;
    },
  },
];

const Actions = ({ activity }: { activity: ActivityData }) => {
  const setActivityEdit = useSetAtom(activityAtom);
  const handleFormOpen = useSetAtom(openForm);
  const setEdit = useSetAtom(editForm);
  const refreshData = useSetAtom(fetchActivitiesAtom);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    const editData={...activity, cropId:activity.cropId._id}

    setActivityEdit(editData);
    setEdit(true);
    handleFormOpen();
  };

  const handleDelete = async () => {
    const url = `${API.EXTERNAL + ENDPOINTS.ACTIVITIES}/${activity._id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (res.ok) {
      refreshData(); // Refresh the data after deletion
      setIsDeleteDialogOpen(false); // Close the delete dialog
    }
  };

  return (
    <>
      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        itemName={activity.description}
      />

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};