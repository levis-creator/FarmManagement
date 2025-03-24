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
import { cropAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { editForm, openForm } from "~/jotai/uiAtoms";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { CropData } from "~/types/types";
import { format } from "date-fns";
import { toast } from "~/hooks/use-toast";

export const CropColumn: ColumnDef<CropData>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium max-w-[200px] truncate" title={row.getValue("name")}>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "variety",
    header: "Variety",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate" title={row.getValue("variety")}>
        {row.getValue("variety")}
      </div>
    ),
  },
  {
    accessorKey: "plantingDate",
    header: "Planting Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("plantingDate"));
      return <div>{format(date, "PPP")}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("plantingDate")).getTime();
      const dateB = new Date(rowB.getValue("plantingDate")).getTime();
      return dateA - dateB;
    },
  },
  {
    accessorKey: "harvestDate",
    header: "Harvest Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("harvestDate"));
      return <div>{format(date, "PPP")}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("harvestDate")).getTime();
      const dateB = new Date(rowB.getValue("harvestDate")).getTime();
      return dateA - dateB;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const statusClasses = {
        Planting: "bg-blue-100 text-blue-800",
        Growing: "bg-green-100 text-green-800",
        Harvesting: "bg-yellow-100 text-yellow-800",
        Completed: "bg-purple-100 text-purple-800",
        default: "bg-gray-100 text-gray-800"
      };
      
      const className = statusClasses[status as keyof typeof statusClasses] || statusClasses.default;

      return (
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
          {status}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const crop = row.original;
      return <CropActions crop={crop} />;
    },
  },
];

const CropActions = ({ crop }: { crop: CropData }) => {
  const setCropEdit = useSetAtom(cropAtom);
  const handleFormOpen = useSetAtom(openForm);
  const setEdit = useSetAtom(editForm);
  const refreshData = useSetAtom(fetchCropsAtom);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setCropEdit(crop);
    setEdit(true);
    handleFormOpen();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const url = `${API.EXTERNAL + ENDPOINTS.CROPS}/${crop._id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete crop");

      toast({
        title: "Success",
        description: "Crop deleted successfully",
        variant: "default",
      });
      refreshData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete crop",
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
        itemName={crop.name}
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