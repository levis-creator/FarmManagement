import { atom } from "jotai";
import { ActivityFormData } from "~/schemas/ActivitySchema";
import { API, ENDPOINTS } from "~/lib/ApiUrl"; // Assuming you have an API utility
import { ActivityData, DbResponse } from "~/types/types";

const url = `${API.EXTERNAL + ENDPOINTS.ACTIVITIES}/all`; // Define the API endpoint

// Atoms
export const activitiesAtom = atom<ActivityData[]>([]); // List of activities
export const activityAtom = atom<ActivityData | null>(null); // Single activity
export const isLoadingAtom = atom<boolean>(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state

// Async action to fetch activities
export const fetchActivitiesAtom = atom(
  null, // No read function (this atom is write-only)
  async (get, set) => {
    set(isLoadingAtom, true); // Set loading state to true
    set(errorAtom, null); // Reset error state

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch activities: ${res.statusText}`);
      }
      const results: DbResponse<ActivityData> = await res.json(); // Assuming the API returns an array of ActivityFormData
      set(activitiesAtom, results.data as ActivityData[]); // Update activitiesAtom with the fetched data
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : "An unknown error occurred"); // Set error state
    } finally {
      set(isLoadingAtom, false); // Set loading state to false
    }
  }
);

// Action to set a single activity
export const setActivityAtom = atom(
  null, // No read function
  (get, set, activity: ActivityFormData) => {
    set(activityAtom, activity); // Update the single activity
  }
);