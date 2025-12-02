import { useQuery } from "@tanstack/react-query";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useTenantTime = () => {
  return useQuery({
    queryKey: ["tenant-time"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/time/tenant`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load tenant time");
      }
      return data.currentDateTimeInTenantTZ;
    },
    refetchInterval: 60*1000, // refresh every 1 minute
  });
};