import { atom } from "jotai";
import { API, ENDPOINTS } from "~/lib/ApiUrl";
import { CropData, DbResponse } from "~/types/types";

const url = API.EXTERNAL + ENDPOINTS.CROPS;

// Atoms
export const cropsAtom = atom<CropData[]>([]); // List of crops
export const cropAtom = atom<CropData | null>(null); // Single crop
export const isLoadingAtom = atom<boolean>(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state

// Async action to fetch crops
export const fetchCropsAtom = atom(
  null, // No read function (this atom is write-only)
  async (get, set) => {
    set(isLoadingAtom, true); // Set loading state to true
    set(errorAtom, null); // Reset error state

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch crops: ${res.statusText}`);
      }
      const results: DbResponse<CropData>= await res.json(); // Assuming the API returns an array of CropFormData
      set(cropsAtom, results.data as CropData[]); // Update cropsAtom with the fetched data
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : "An unknown error occurred"); // Set error state
    } finally {
      set(isLoadingAtom, false); // Set loading state to false
    }
  }
);