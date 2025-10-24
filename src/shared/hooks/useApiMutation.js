import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useApiMutation = (mutationFn, invalidateKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateKey]);
    }
  });
};