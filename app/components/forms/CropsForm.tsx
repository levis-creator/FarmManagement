import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { closeForm, formIsOpen } from "~/jotai/uiAtoms";
import { CropFormData, CropSchema } from "~/schemas/CropSchema";
import { Modal } from "../common/Modal";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Import the spinner icon

export default function CropsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CropFormData>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      status: "Planting", // Default status
    },
  });

  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onSubmit: SubmitHandler<CropFormData> = async (data) => {
    setIsLoading(true); // Start loading
    try {
      // Simulate an API call to add data to the database
      const response = await fetch("http://localhost:5000/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Crop added successfully!");
        close(); // Close the modal on success
      } else {
        console.error("Failed to add crop");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Modal isOpen={isOpen} title="Crops" onClose={close}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Crop Name
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

        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-gray-700">
            Variety
          </label>
          <Input
            id="variety"
            {...register("variety")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.variety && (
            <p className="text-sm text-red-600 mt-1">{errors.variety.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700">
            Planting Date
          </label>
          <Input
            id="plantingDate"
            type="date"
            {...register("plantingDate", { valueAsDate: true })}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.plantingDate && (
            <p className="text-sm text-red-600 mt-1">{errors.plantingDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">
            Harvest Date
          </label>
          <Input
            id="harvestDate"
            type="date"
            {...register("harvestDate", { valueAsDate: true })}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.harvestDate && (
            <p className="text-sm text-red-600 mt-1">{errors.harvestDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            onValueChange={(value) => setValue("status", value as CropFormData["status"])}
            defaultValue="Planting"
          >
            <SelectTrigger className="mt-1 w-full border-green-300 focus:border-green-500 focus:ring-green-500 flex">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planting">Planting</SelectItem>
              <SelectItem value="Growing">Growing</SelectItem>
              <SelectItem value="Harvesting">Harvesting</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>

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
              "Add Crop"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}