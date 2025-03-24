import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { closeForm, editForm, formIsOpen } from "~/jotai/uiAtoms";
import { CropFormData, CropSchema } from "~/schemas/CropSchema";
import { Modal } from "../common/Modal";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cropAtom, fetchCropsAtom } from "~/jotai/cropsAtom";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { format } from "date-fns";
import { toast } from "~/hooks/use-toast";

export default function CropsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isDirty },
  } = useForm<CropFormData>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      status: "Planting",
      plantingDate: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const refreshData = useSetAtom(fetchCropsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useAtom(cropAtom);
  const [edit, setEdit] = useAtom(editForm);

  // Watch date fields for validation
  const plantingDate = watch("plantingDate");
  const harvestDate = watch("harvestDate");

  // Initialize form for editing
  useEffect(() => {
    if (edit && crop) {
      setValue("name", crop.name);
      setValue("variety", crop.variety);
      setValue("plantingDate", format(new Date(crop.plantingDate), 'yyyy-MM-dd'));
      setValue("harvestDate", crop.harvestDate ? format(new Date(crop.harvestDate), 'yyyy-MM-dd') : "");
      setValue("status", crop.status);
    } else {
      // Reset to default values when not in edit mode
      reset({
        status: "Planting",
        plantingDate: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [edit, crop, setValue, reset]);

  // Auto-correct harvest date if before planting date
  useEffect(() => {
    if (plantingDate && harvestDate && new Date(harvestDate) < new Date(plantingDate)) {
      setValue("harvestDate", plantingDate);
    }
    trigger("harvestDate");
  }, [plantingDate, harvestDate, setValue, trigger]);

  const onSubmit: SubmitHandler<CropFormData> = async (data) => {
    setIsLoading(true);
    try {
      const url = edit
        ? `${API.EXTERNAL + ENDPOINTS.CROPS}/${crop?._id}`
        : API.EXTERNAL + ENDPOINTS.CROPS;

      const response = await fetch(url, {
        method: edit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          plantingDate: new Date(data.plantingDate),
          harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      toast({
        title: "Success",
        description: `Crop ${edit ? "updated" : "created"} successfully!`,
        variant: "default",
      });
      
      refreshData();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: `Failed to ${edit ? "update" : "create"} crop`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setCrop(null);
    setEdit(false);
    close();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      title={edit ? "Edit Crop" : "Add Crop"} 
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-green-800">
            Crop Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            {...register("name")}
            className="w-full border-green-300 focus:border-green-500"
            placeholder="Enter crop name"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Variety Field */}
        <div className="space-y-2">
          <label htmlFor="variety" className="block text-sm font-medium text-green-800">
            Variety
          </label>
          <Input
            id="variety"
            {...register("variety")}
            className="w-full border-green-300 focus:border-green-500"
            placeholder="Enter variety (optional)"
          />
          {errors.variety && (
            <p className="text-sm text-red-600">{errors.variety.message}</p>
          )}
        </div>

        {/* Planting Date */}
        <div className="space-y-2">
          <label htmlFor="plantingDate" className="block text-sm font-medium text-green-800">
            Planting Date <span className="text-red-500">*</span>
          </label>
          <Input
            id="plantingDate"
            type="date"
            {...register("plantingDate")}
            className="w-full border-green-300 focus:border-green-500"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.plantingDate && (
            <p className="text-sm text-red-600">{errors.plantingDate.message}</p>
          )}
        </div>

        {/* Harvest Date */}
        <div className="space-y-2">
          <label htmlFor="harvestDate" className="block text-sm font-medium text-green-800">
            Harvest Date
          </label>
          <Input
            id="harvestDate"
            type="date"
            {...register("harvestDate", {
              validate: value => !value || new Date(value) >= new Date(plantingDate),
            })}
            className="w-full border-green-300 focus:border-green-500"
            min={plantingDate}
            placeholder="Select harvest date (optional)"
          />
          {errors.harvestDate && (
            <p className="text-sm text-red-600">
              {errors.harvestDate.type === "validate"
                ? "Harvest date must be after planting date"
                : "Invalid date format"}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-green-800">
            Status <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue("status", value as CropFormData["status"])}
            value={watch("status")}
          >
            <SelectTrigger className="w-full border-green-300 focus:border-green-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planting" className="hover:bg-green-50">
                Planting
              </SelectItem>
              <SelectItem value="Growing" className="hover:bg-green-50">
                Growing
              </SelectItem>
              <SelectItem value="Harvesting" className="hover:bg-green-50">
                Harvesting
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-green-600 text-green-800 hover:bg-green-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading || !isDirty}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {edit ? "Saving..." : "Creating..."}
              </>
            ) : edit ? "Save Changes" : "Create Crop"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}