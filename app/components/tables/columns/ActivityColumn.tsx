import { ColumnDef } from "@tanstack/react-table";
import { useSetAtom } from "jotai";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { ActivityData, CropData } from "~/types/types";
import { format } from "date-fns";
import { toast } from "~/hooks/use-toast";

export const ActivityColumn: ColumnDef<ActivityData>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.getValue("description")}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{format(date, "PPP")}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("date")).getTime();
      const dateB = new Date(rowB.getValue("date")).getTime();
      return dateA - dateB;
    },
  },
  {
    accessorKey: "cropId",
    header: "Crop Name",
    cell: ({ row }) => {
      const crop: CropData = row.getValue("cropId");
      return (
        <div className="font-medium">{crop?.name || "N/A"}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const activity = row.original;
      return <ActivityActions activity={activity} />;
    },
  },
];

const ActivityActions = ({ activity }: { activity: ActivityData }) => {
  const setActivityEdit = useSetAtom(activityAtom);
  const handleFormOpen = useSetAtom(openForm);
  const setEdit = useSetAtom(editForm);
  const refreshData = useSetAtom(fetchActivitiesAtom);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    const editData = {
      ...activity,
      cropId: activity.cropId._id,
      date: format(new Date(activity.date), "yyyy-MM-dd")
    };
    setActivityEdit(editData);
    setEdit(true);
    handleFormOpen();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const url = `${API.EXTERNAL + ENDPOINTS.ACTIVITIES}/${activity._id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${yourAuthToken}`
        },
      });

      const data = await response.json(); // Parse the response

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete activity");
      }

      toast({
        title: "Success",
        description: "Activity deleted successfully",
        variant: "default",
      });
      
      refreshData(); // Refresh the data
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete activity",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        itemName={activity.description}
        isLoading={isDeleting}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)} 
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};