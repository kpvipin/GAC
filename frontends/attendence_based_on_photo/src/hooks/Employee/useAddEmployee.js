import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  const addEmployee = async (employeeData) => {
    const res = await fetch(`${API_BASE_URL}/api/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to add employee");
    }
    return data.data;
  };

  return useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      // Invalidate employee list so it refetches after adding
      queryClient.invalidateQueries(["employees"]);
    },
  });
};
