// Helper function to convert ISO date to YYYY-MM-DD format
export const formatDateForInput = (isoDateString: string) => {
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates
  return date.toISOString().split("T")[0];
};

// Helper function to convert YYYY-MM-DD string to Date object
export const parseDateFromInput = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};