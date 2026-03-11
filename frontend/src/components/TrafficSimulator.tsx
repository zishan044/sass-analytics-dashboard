'use client';

import { Button } from '@/components/ui/button';
import { Play, Square, Activity } from 'lucide-react';
import { useTrafficSimulator } from '@/hooks/useTrafficSimulator';

export function TrafficSimulator({ projectId }: { projectId: number }) {
  const { isSimulating, setIsSimulating } = useTrafficSimulator(projectId);

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <Activity className={`h-4 w-4 ${isSimulating ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
        <span className="text-sm font-medium">Auto-Traffic</span>
      </div>
      
      <Button 
        variant={isSimulating ? "destructive" : "outline"} 
        size="sm"
        onClick={() => setIsSimulating(!isSimulating)}
      >
        {isSimulating ? <><Square className="mr-2 h-4 w-4" /> Stop</> : <><Play className="mr-2 h-4 w-4" /> Start</>}
      </Button>
    </div>
  );
}