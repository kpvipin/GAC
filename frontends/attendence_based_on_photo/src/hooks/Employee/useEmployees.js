import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useEmployees = () => {
    return useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/employees`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to load employees");
            }
            return data.data;
        },
    });
};
