import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react"; // Import the spinner icon
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button"; // Adjust the import path
import { Input } from "~/components/ui/input"; // Adjust the import path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"; // Adjust the import path
import { closeForm, formIsOpen } from "~/jotai/uiAtoms";
import { ActivityFormData, ActivitySchema } from "~/schemas/ActivitySchema";
import { Modal } from "../common/Modal"; // Adjust the import path
import { Textarea } from "../ui/textarea";

type ActivityFormProps = {
  crops: { _id: string; name: string }[]; // List of crops for the dropdown
};

export function ActivityForm({ crops }: ActivityFormProps) {
  const onClose = useSetAtom(closeForm);
  const isOpen = useAtomValue(formIsOpen);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      date: new Date(), // Default to today's date
    },
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onSubmit: SubmitHandler<ActivityFormData> = async (data) => {
    setIsLoading(true); // Start loading
    console.log(data)
    // try {
    //   // Simulate an API call to add data to the database
    //   const response = await fetch("/api/activities", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (response.ok) {
    //     console.log("Activity added successfully!");
    //     onClose(); // Close the modal on success
    //   } else {
    //     console.error("Failed to add activity");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // } finally {
    //   setIsLoading(false); // Stop loading
    // }
  };

  return (
    <Modal isOpen={isOpen} title="Add Activity" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
        {/* Crop Input (First Field) */}
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

        {/* Date Input (Second Field) */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            id="date"
            type="date"
            {...register("date", { valueAsDate: true })}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Description Input (Third Field) */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm p-2"
            rows={4} // Adjust the number of rows as needed
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
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
              "Add Activity"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}