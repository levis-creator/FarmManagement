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
import { cropAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { editForm, openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { CropFormData } from "~/schemas/CropSchema";
import { CropData } from "~/types/types";

// Define the columns for the table
export const CropColumn: ColumnDef<CropFormData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "variety",
    header: "Variety",
    cell: ({ row }) => <div>{row.getValue("variety")}</div>,
  },
  {
    accessorKey: "plantingDate",
    header: "Planting Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("plantingDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "harvestDate",
    header: "Harvest Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("harvestDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      let badgeColor = "";

      // Assign different colors based on the status
      switch (status) {
        case "Planting":
          badgeColor = "bg-blue-500 text-white";
          break;
        case "Growing":
          badgeColor = "bg-green-500 text-white";
          break;
        case "Harvesting":
          badgeColor = "bg-yellow-500 text-black";
          break;
        default:
          badgeColor = "bg-gray-500 text-white";
      }

      return (
        <div className={`px-3 py-1 rounded-full text-sm ${badgeColor}`}>
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const crop = row.original;
      return <Actions crop={crop} />;
    },
  },
];

const Actions = ({ crop }: { crop: CropData }) => {
  const setCropEdit = useSetAtom(cropAtom);
  const handleFormOpen = useSetAtom(openForm);
  const setEdit = useSetAtom(editForm);
  const refreshData = useSetAtom(fetchCropsAtom);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setCropEdit(crop);
    setEdit(true);
    handleFormOpen();
  };

  const handleDelete = async () => {
    const url = `${API.EXTERNAL + ENDPOINTS.CROPS}/${crop._id}`;
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
        itemName={crop.name}
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