import { useQuery } from "@tanstack/react-query";
import { fetchProjectAnalytics } from "@/lib/api";

export function useAnalytics(projectId: number | null) {
  return useQuery({
    queryKey: ["analytics", projectId],
    queryFn: () => fetchProjectAnalytics(projectId!),
    enabled: !!projectId,
    select: (response) => {
      const data = response.data;
      
      const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
      const totalEvents = data.reduce((acc, curr) => acc + curr.events, 0);
      
      return {
        chartData: data,
        totalRevenue,
        totalEvents,
      };
    },
  });
}