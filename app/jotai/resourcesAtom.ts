import { atom } from "jotai";
import { ResourceFormData } from "~/schemas/ResourceSchema";
import { API, ENDPOINTS } from "~/lib/ApiUrl"; // Assuming you have an API utility

const url = API.EXTERNAL + ENDPOINTS.RESOURCES; // Define the API endpoint

// Atoms
export const resourcesAtom = atom<ResourceFormData[]>([]); // List of resources
export const resourceAtom = atom<ResourceFormData | null>(null); // Single resource
export const isLoadingAtom = atom<boolean>(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state

// Async action to fetch resources
export const fetchResourcesAtom = atom(
  null, // No read function (this atom is write-only)
  async (get, set) => {
    set(isLoadingAtom, true); // Set loading state to true
    set(errorAtom, null); // Reset error state

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch resources: ${res.statusText}`);
      }
      const results: ResourceFormData[] = await res.json(); // Assuming the API returns an array of ResourceFormData
      set(resourcesAtom, results); // Update resourcesAtom with the fetched data
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : "An unknown error occurred"); // Set error state
    } finally {
      set(isLoadingAtom, false); // Set loading state to false
    }
  }
);

// Action to set a single resource
export const setResourceAtom = atom(
  null, // No read function
  (get, set, resource: ResourceFormData) => {
    set(resourceAtom, resource); // Update the single resource
  }
);