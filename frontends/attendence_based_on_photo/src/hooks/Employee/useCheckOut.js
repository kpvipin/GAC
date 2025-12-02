import { useMutation, useQueryClient } from "@tanstack/react-query";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export function useCheckOut() {
    const queryClient = useQueryClient();
    const checkOutEmployee = async (sessionId) => {
        const response = await fetch(`${API_BASE_URL}/api/attendance/check-out`, {
            method: "POST",
            body: JSON.stringify({ sessionId }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to check out employee");
        }
        return response.json();
    };
    return useMutation({
        mutationFn: (sessionId) => checkOutEmployee(sessionId),
        onSuccess: () => {
            // Refetch employee list or attendance list if needed
            queryClient.invalidateQueries(["employees"]);
        },
    });
}
