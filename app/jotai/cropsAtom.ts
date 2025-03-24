import { atom } from "jotai";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { CropData, DbResponse, Stats } from "~/types/types";
import { statsAtom } from "./statsAtom";
import { Sprout, Tractor } from "lucide-react";

const url = API.EXTERNAL + ENDPOINTS.CROPS;

// Atoms
export const cropsAtom = atom<CropData[]>([]); // List of crops
export const cropAtom = atom<CropData | null>(null); // Single crop
export const isLoadingAtom = atom<boolean>(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state

// Async action to fetch crops
export const fetchCropsAtom = atom(
  null, // No read function (write-only atom)
  async (get, set) => {
    set(isLoadingAtom, true); // Set loading state to true
    set(errorAtom, null); // Reset error state

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch crops: ${res.statusText}`);
      }

      const results: DbResponse<CropData> = await res.json(); 

      const data=results.data as CropData[]
      const stats:Stats= {title: "Total Crops", value: `${data.length}`, icon: Sprout, trend: "↑ 12% from last month" }
      const harvest:Stats={ title: "Ready for Harvest", value: `${data.length}`, icon: Tractor, trend: "Next week" }

      set(cropsAtom, data); 

      set(statsAtom, (data)=>[...data, stats, harvest ])
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      set(isLoadingAtom, false);
    }
  }
);
