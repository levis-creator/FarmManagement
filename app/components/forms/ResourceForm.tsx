
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react"; // Import the spinner icon
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button"; // Adjust the import path
import { Input } from "~/components/ui/input"; // Adjust the import path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"; // Adjust the import path
import { closeForm, formIsOpen } from "~/jotai/uiAtoms";
import { ResourceFormData, ResourceSchema } from "~/schemas/ResourceSchema";
import { Modal } from "../common/Modal"; // Adjust the import path
import { zodResolver } from "@hookform/resolvers/zod";

type ResourceFormProps = {
  crops: { _id: string; name: string }[]; // List of crops for the dropdown
};

export function ResourceForm({ crops }: ResourceFormProps) {
  const onClose = useSetAtom(closeForm);
  const isOpen = useAtomValue(formIsOpen);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(ResourceSchema),
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onSubmit: SubmitHandler<ResourceFormData> = async (data) => {
    setIsLoading(true); // Start loading

    try {
      // Simulate an API call to add data to the database
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Resource added successfully!");
        onClose(); // Close the modal on success
      } else {
        console.error("Failed to add resource");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Modal isOpen={isOpen} title="Add Resource" onClose={onClose}>
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
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Adding...
              </div>
            ) : (
              "Add Resource"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}