import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SystemStats as SystemStatsType, Task } from './types';

interface SystemStatsProps {
  systemStats: SystemStatsType;
  tasks: Task[];
}

export const SystemStats = ({ systemStats, tasks }: SystemStatsProps) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">CPU</span>
          <span className="text-primary font-bold">{systemStats.cpu}%</span>
        </div>
        <Progress value={systemStats.cpu} className="h-2" />
      </Card>

      <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">RAM</span>
          <span className="text-secondary font-bold">{systemStats.ram}%</span>
        </div>
        <Progress value={systemStats.ram} className="h-2" />
      </Card>

      <Card className="bg-card/80 border-2 border-accent/40 neon-box p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">DISK</span>
          <span className="text-accent font-bold">{systemStats.disk}%</span>
        </div>
        <Progress value={systemStats.disk} className="h-2" />
      </Card>

      <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Задач</span>
          <span className="text-primary font-bold">{tasks.filter(t => !t.completed).length}</span>
        </div>
        <Progress value={(tasks.filter(t => t.completed).length / Math.max(tasks.length, 1)) * 100} className="h-2" />
      </Card>
    </div>
  );
};
