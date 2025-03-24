import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useSetAtom } from "jotai";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DeleteDialog } from "~/components/common/DeleteDialog";
import { ResourceFormData } from "~/schemas/ResourceSchema";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { editForm, openForm } from "~/jotai/uiAtoms";
import { useState } from "react";
import { toast } from "~/hooks/use-toast";
import { fetchResourcesAtom, resourceAtom } from "~/jotai/resourcesAtom";

export const ResourceColumns: ColumnDef<ResourceFormData>[] = [
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
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-right">
        {Number(row.getValue("quantity")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "cropId",
    header: "Crop",
    cell: ({ row }) => {
      const crop = row.getValue("cropId") as { _id: string; name: string };
      return <div>{crop?.name || "N/A"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const resource = row.original;
      return <ResourceActions resource={resource} />;
    },
  },
];

const ResourceActions = ({ resource }: { resource: ResourceFormData }) => {
  const setResourceEdit = useSetAtom(resourceAtom);
  const handleFormOpen = useSetAtom(openForm);
  const setEdit = useSetAtom(editForm);
  const refreshData = useSetAtom(fetchResourcesAtom);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    const editData = {
      ...resource,
      cropId: resource.cropId._id // Extract just the ID for the form
    };
    setResourceEdit(editData);
    setEdit(true);
    handleFormOpen();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const url = `${API.EXTERNAL + ENDPOINTS.RESOURCES}/${resource._id}`;
      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete resource");

      toast({
        title: "Success",
        description: "Resource deleted successfully",
        variant: "default",
      });
      refreshData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete resource",
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
        itemName={resource.name}
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