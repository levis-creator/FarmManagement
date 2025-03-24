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
import { format, parseISO } from "date-fns";
import { toast } from "~/hooks/use-toast";

export function ActivityForm({ crops }: { crops: CropData[] }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'), // Default to today's date
      cropId: '',
      description: ''
    },
  });

  // State management
  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const refreshData = useSetAtom(fetchActivitiesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [activity, setActivity] = useAtom(activityAtom);
  const [edit, setEdit] = useAtom(editForm);

  // Initialize form for editing
  useEffect(() => {
    if (edit && activity) {
      setValue("cropId", activity.cropId as string);
      setValue("date", format(parseISO(activity.date), 'yyyy-MM-dd'));
      setValue("description", activity.description);
    } else {
      reset(); // Reset form when not in edit mode
    }
  }, [edit, activity, setValue, reset]);

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
          // Add authorization header if needed
          // "Authorization": `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save activity');
      }

      toast({
        title: "Success",
        description: `Activity ${edit ? "updated" : "created"} successfully`,
        variant: "default",
      });
      
      refreshData();
      handleClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save activity",
        variant: "destructive",
      });
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
    <Modal 
      isOpen={isOpen} 
      title={edit ? "Edit Activity" : "Add Activity"} 
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        {/* Crop Selection */}
        <div className="space-y-2">
          <label htmlFor="cropId" className="block text-sm font-medium text-gray-700">
            Crop <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue("cropId", value)}
            value={watch("cropId")}
          >
            <SelectTrigger className="w-full">
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
            <p className="text-sm text-red-600">{errors.cropId.message}</p>
          )}
        </div>

        {/* Date Input */}
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="date"
            type="date"
            {...register("date")}
            className="w-full"
          />
          {errors.date && (
            <p className="text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="w-full min-h-[100px]"
            placeholder="Enter activity details..."
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {edit ? "Saving..." : "Creating..."}
              </>
            ) : edit ? "Save Changes" : "Create Activity"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}