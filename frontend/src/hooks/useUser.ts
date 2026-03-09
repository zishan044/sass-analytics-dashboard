import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/lib/api"

export const useUser = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: data,
    isLoading,
    isError,
    refetch,
  };
};