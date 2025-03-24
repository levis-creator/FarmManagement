import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { closeForm, editForm, formIsOpen } from "~/jotai/uiAtoms";
import { ResourceFormData, ResourceSchema } from "~/schemas/ResourceSchema";
import { Modal } from "../common/Modal";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { fetchResourcesAtom, resourceAtom } from "~/jotai/resourcesAtom";

type ResourceFormProps = {
  crops: { _id: string; name: string }[];
};

export function ResourceForm({ crops }: ResourceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(ResourceSchema),
    defaultValues: {
      quantity: 0, // Default quantity
    },
  });

  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const refreshData = useSetAtom(fetchResourcesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useAtom(resourceAtom);
  const [edit, setEdit] = useAtom(editForm);

  // Initialize form for editing
  useEffect(() => {
    if (edit && resource) {
      setValue("name", resource.name);
      setValue("quantity", resource.quantity);
      setValue("type", resource.type);
      setValue("cropId", resource.cropId);
    }
  }, [edit, resource, setValue]);

  const onSubmit: SubmitHandler<ResourceFormData> = async (data) => {
    setIsLoading(true);
    try {
      const url = edit
        ? `${API.EXTERNAL + ENDPOINTS.RESOURCES}/${resource?._id}`
        : API.EXTERNAL + ENDPOINTS.RESOURCES;

      const response = await fetch(url, {
        method: edit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(response.statusText);

      console.log(`Resource ${edit ? "updated" : "added"} successfully!`);
      refreshData();
      handleClose();
    } catch (error) {
      console.error(`Failed to ${edit ? "update" : "add"} resource:`, error);
      // Consider adding user feedback here (e.g., toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setResource(null);
    setEdit(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} title={edit ? "Edit Resource" : "Add Resource"} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.quantity && (
            <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        {/* Type Input */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <Input
            id="type"
            {...register("type")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.type && (
            <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        {/* Crop Input */}
        <div>
          <label htmlFor="cropId" className="block text-sm font-medium text-gray-700">
            Crop
          </label>
          <Select
            onValueChange={(value) => setValue("cropId", value)}
            value={watch("cropId")}
          >
            <SelectTrigger className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Select a crop" />
            </SelectTrigger>
            <SelectContent>
              {crops.map((crop) => (
                <SelectItem key={crop._id} value={crop._id}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cropId && (
            <p className="text-sm text-red-600 mt-1">{errors.cropId.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {edit ? "Saving..." : "Adding..."}
              </div>
            ) : (
              edit ? "Save Changes" : "Add Resource"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}