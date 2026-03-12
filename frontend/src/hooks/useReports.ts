import { useQuery, useMutation } from "@tanstack/react-query";
import { reportApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export const useReportPolling = (projectId: number) => {
  const generateMutation = useMutation({
    mutationFn: () => reportApi.generate(projectId),
    onError: () => toast.error("Failed to start report"),
  });

  const taskId = generateMutation.data?.task_id;

  const statusQuery = useQuery({
    queryKey: ["report-status", taskId],
    queryFn: () => reportApi.getStatus(taskId!),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return (status === "SUCCESS" || status === "FAILURE") ? false : 2000;
    },
  });

  return {
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending || 
                  (statusQuery.data?.status === "PENDING" || statusQuery.data?.status === "STARTED"),
    reportData: statusQuery.data,
    error: statusQuery.error || generateMutation.error,
  };
};