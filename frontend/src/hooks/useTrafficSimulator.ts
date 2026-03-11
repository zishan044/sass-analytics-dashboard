import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ingestEvents, EventCreate } from "@/lib/api";
import { toast } from "react-hot-toast";

export function useTrafficSimulator(projectId: number) {
  const [isSimulating, setIsSimulating] = useState(false);
  const queryClient = useQueryClient();

  const generateBatch = useCallback(async () => {
    const eventTypes = ["page_view", "click", "signup", "purchase"];
    const batchSize = Math.floor(Math.random() * 10) + 5;

    const events: EventCreate[] = Array.from({ length: batchSize }).map(() => ({
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      value: Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0,
    }));

    try {
      await ingestEvents({ project_id: projectId, events });

      queryClient.invalidateQueries({ queryKey: ["analytics", projectId] });

      toast.success(`Simulated ${batchSize} events for Project #${projectId}`, {
        duration: 2000,
      });
    } catch (error) {
      toast.error("Traffic simulation stopped due to an error.");
      setIsSimulating(false);
    }
  }, [projectId, queryClient]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(generateBatch, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, generateBatch]);

  return { isSimulating, setIsSimulating };
}
