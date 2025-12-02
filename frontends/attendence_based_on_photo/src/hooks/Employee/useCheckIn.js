import { useMutation, useQueryClient } from "@tanstack/react-query";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export function useCheckIn() {
    const queryClient = useQueryClient();
    const checkInEmployee = async (userId) => {
        const response = await fetch(`${API_BASE_URL}/api/attendance/check-in`, {
            method: "POST",
            body: JSON.stringify({ userId }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to check in employee");
        }
        return response.json();
    };
    return useMutation({
        mutationFn: (userId) => checkInEmployee(userId),
        onSuccess: () => {
            // Refetch employee list or attendance list if needed
            queryClient.invalidateQueries(["employees"]);
        },
    });
}
