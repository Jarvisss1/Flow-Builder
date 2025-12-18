import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Database, Server, Globe, HardDrive, Cpu, Activity, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ServiceNodeData } from '@/api/mockApi';

const icons = {
  database: Database,
  server: Server,
  client: Globe,
};

export function ServiceNode({ data, selected }: NodeProps<Node<ServiceNodeData>>) {
  const Icon = icons[data.type as keyof typeof icons] || Server;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
      case 'degraded': return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
      case 'down': return 'bg-rose-500/15 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/15 text-slate-500 border-slate-500/20';
    }
  };

  const isDatabase = data.type === 'database';
  const themeColor = isDatabase ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' : 'text-blue-500 bg-blue-500/10 border-blue-500/30';
  const ringColor = isDatabase ? 'ring-cyan-500 border-cyan-500' : 'ring-blue-500 border-blue-500';

  return (
    <div className={`
      relative min-w-[280px] rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200
      ${selected ? `ring-2 ${ringColor}` : 'border-border hover:border-border/80'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${themeColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-none">{data.label}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{data.type}</span>
          </div>
        </div>
        <Badge variant="outline" className={`capitalize ${getStatusColor(data.status)}`}>
           {data.status === 'down' ? <AlertCircle className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
           {data.status}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="space-y-1 p-2 rounded-md bg-muted/40 border border-border/50">
           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
             <Cpu className="w-3.5 h-3.5" />
             <span>CPU</span>
           </div>
           <div className="text-lg font-mono font-medium">{data.config?.cpu || 0.5}c</div>
        </div>

        <div className="space-y-1 p-2 rounded-md bg-muted/40 border border-border/50">
           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
             <HardDrive className="w-3.5 h-3.5" />
             <span>Mem</span>
           </div>
           <div className="text-lg font-mono font-medium">{data.config?.memory || 128}MB</div>
        </div>
      </div>

      {/* Footer/Visual Bar */}
      <div className="px-4 pb-4">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
           <div 
             className="h-full bg-primary transition-all duration-300" 
             style={{ width: `${Math.min(100, (data.runtime?.uptime || 0))}%` }}
           />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
           <span>Uptime</span>
           <span className="font-mono">{data.runtime?.uptime}%</span>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-muted-foreground border-2 border-background" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-muted-foreground border-2 border-background" />
    </div>
  );
}
