import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { closeForm, editForm, formIsOpen } from "~/jotai/uiAtoms";
import { ActivityFormData, ActivitySchema } from "~/schemas/ActivitySchema";
import { Modal } from "../common/Modal";
import { Textarea } from "../ui/textarea";
import { CropData } from "~/types/types";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { activityAtom, fetchActivitiesAtom } from "~/jotai/activitiesAtom";

// Helper function to convert ISO date to YYYY-MM-DD format
const formatDateForInput = (isoDateString: string) => {
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates
  return date.toISOString().split("T")[0];
};

type ActivityFormProps = {
  crops: CropData[]; // List of crops for the dropdown
};

export function ActivityForm({ crops }: ActivityFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], // Default to today's date
    },
  });

  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const refreshData = useSetAtom(fetchActivitiesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [activity, setActivity] = useAtom(activityAtom);
  const [edit, setEdit] = useAtom(editForm);

  // Initialize form for editing
  useEffect(() => {
    if (edit && activity) {
      setValue("cropId", activity.cropId);
      setValue("date", formatDateForInput(activity.date));
      setValue("description", activity.description);
    }
  }, [edit, activity, setValue]);

  const onSubmit: SubmitHandler<ActivityFormData> = async (data) => {
    setIsLoading(true);
    try {
      const url = edit
        ? `${API.EXTERNAL + ENDPOINTS.ACTIVITIES}/${activity?._id}`
        : API.EXTERNAL + ENDPOINTS.ACTIVITIES;

      const response = await fetch(url, {
        method: edit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(`Activity ${edit ? "updated" : "added"} successfully!`);
        refreshData();
        handleClose();
      } else {
        console.error(`Failed to ${edit ? "update" : "add"} activity`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setActivity(null);
    setEdit(false);
    close();
  };

  return (
    <Modal isOpen={isOpen} title={edit ? "Edit Activity" : "Add Activity"} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
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
                <SelectItem key={crop._id} value={crop._id as string}>
                  {crop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cropId && (
            <p className="text-sm text-red-600 mt-1">{errors.cropId.message}</p>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.date && (
            <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm p-2"
            rows={4}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {edit ? "Saving..." : "Adding..."}
              </div>
            ) : (
              edit ? "Save Changes" : "Add Activity"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}