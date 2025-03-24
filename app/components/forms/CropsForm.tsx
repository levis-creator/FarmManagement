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

// Helper function to convert ISO date to YYYY-MM-DD format
const formatDateForInput = (isoDateString: string) => {
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates
  return date.toISOString().split("T")[0];
};

// Helper function to convert YYYY-MM-DD string to Date object
const parseDateFromInput = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export default function CropsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<CropFormData>({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      status: "Planting",
    },
  });

  const isOpen = useAtomValue(formIsOpen);
  const close = useSetAtom(closeForm);
  const refreshData = useSetAtom(fetchCropsAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useAtom(cropAtom);
  const [edit, setEdit] = useAtom(editForm);

  // Watch date fields and re-validate when they change
  const plantingDate = watch("plantingDate");
  const harvestDate = watch("harvestDate");

  // Initialize form for editing
  useEffect(() => {
    if (edit && crop) {
      setValue("name", crop.name);
      setValue("variety", crop.variety);
      setValue("plantingDate", formatDateForInput(crop.plantingDate));
      setValue("harvestDate", formatDateForInput(crop.harvestDate));
      setValue("status", crop.status);
    }
  }, [edit, crop, setValue]);

  // Date validation and auto-correction
  useEffect(() => {
    if (plantingDate && harvestDate) {
      if (new Date(harvestDate) < new Date(plantingDate)) {
        setValue("harvestDate", plantingDate);
      }
      trigger("harvestDate");
    }
  }, [plantingDate, harvestDate, setValue, trigger]);

  const onSubmit: SubmitHandler<CropFormData> = async (data) => {
    setIsLoading(true);
    try {
      const url = edit
        ? `${API.EXTERNAL + ENDPOINTS.CROPS}/${crop?._id}`
        : API.EXTERNAL + ENDPOINTS.CROPS;

      // Convert YYYY-MM-DD strings to Date objects
      const payload = {
        ...data,
        plantingDate: parseDateFromInput(data.plantingDate),
        harvestDate: parseDateFromInput(data.harvestDate),
      };

      const response = await fetch(url, {
        method: edit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Crop ${edit ? "updated" : "added"} successfully!`);
        refreshData();
        handleClose();
      } else {
        console.error(`Failed to ${edit ? "update" : "add"} crop`);
      }
    } catch (error) {
      console.error("Error:", error);
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

  // Safe date string for input min attribute
  const minHarvestDate = plantingDate ? plantingDate : "";

  return (
    <Modal isOpen={isOpen} title={edit ? "Edit Crop" : "Add Crop"} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Crop Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Variety Field */}
        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-gray-700">
            Variety
          </label>
          <Input
            id="variety"
            {...register("variety")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.variety && <p className="text-sm text-red-600 mt-1">{errors.variety.message}</p>}
        </div>

        {/* Planting Date */}
        <div>
          <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700">
            Planting Date
          </label>
          <Input
            id="plantingDate"
            type="date"
            {...register("plantingDate")}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
          />
          {errors.plantingDate && <p className="text-sm text-red-600 mt-1">{errors.plantingDate.message}</p>}
        </div>

        {/* Harvest Date with Validation */}
        <div>
          <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">
            Harvest Date
          </label>
          <Input
            id="harvestDate"
            type="date"
            {...register("harvestDate", {
              validate: value => new Date(value) >= new Date(plantingDate),
            })}
            className="mt-1 block w-full border-green-300 focus:border-green-500 focus:ring-green-500"
            min={minHarvestDate as string}
          />
          {errors.harvestDate && (
            <p className="text-sm text-red-600 mt-1">
              {errors.harvestDate.type === "invalid_date"
                ? "Invalid date format"
                : "Harvest date must be after planting date"}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            onValueChange={(value) => setValue("status", value as CropFormData["status"])}
            value={watch("status")}
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
          {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>}
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
                {edit ? "Saving..." : "Creating..."}
              </div>
            ) : (
              edit ? "Save Changes" : "Add Crop"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}