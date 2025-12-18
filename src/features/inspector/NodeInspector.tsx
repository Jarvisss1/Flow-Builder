import { useAppStore } from '@/store/useAppStore';
import { useReactFlow, useNodes } from '@xyflow/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X, Server, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ServiceNodeData } from '@/api/mockApi';
import { useDebounce } from '@/hooks/useDebounce';

export function NodeInspector() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.actions.setSelectedNodeId);
  const activeTab = useAppStore((state) => state.activeInspectorTab);
  const setActiveTab = useAppStore((state) => state.actions.setActiveInspectorTab);
  
  const nodes = useNodes(); // Reactive nodes state
  const { setNodes } = useReactFlow();
  const node = nodes.find((n) => n.id === selectedNodeId);
  const data = node?.data as ServiceNodeData | undefined;

  // Local state for immediate feedback
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memory, setMemory] = useState(0);

  const debouncedName = useDebounce(name, 500);
  const debouncedDescription = useDebounce(description, 500);

  // Sync from node to local state ONLY on selection change to avoid overwriting user input while typing
  useEffect(() => {
    if (data) {
      setName(data.label || '');
      setDescription(data.description || '');
      setMemory(data.config?.memory || 0);
    }
  }, [selectedNodeId]); 

  // Sync debounced Name to React Flow
  useEffect(() => {
    if (node && debouncedName !== node.data.label) {
       setNodes((nds) => 
        nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, label: debouncedName } } : n)
       );
    }
  }, [debouncedName, selectedNodeId, setNodes]);

  // Sync debounced Description to React Flow
  useEffect(() => {
    if (node && debouncedDescription !== node.data.description) {
       setNodes((nds) => 
        nds.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, description: debouncedDescription } } : n)
       );
    }
  }, [debouncedDescription, selectedNodeId, setNodes]);

  if (!node || !data) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    // Removed immediate setNodes call
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    // Removed immediate setNodes call
  };

  const handleMemoryChange = (val: number) => {
    setMemory(val);
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === selectedNodeId
          ? { ...n, data: { ...n.data, config: { ...(n.data as ServiceNodeData).config, memory: val } } }
          : n
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'bg-green-500 hover:bg-green-600';
      case 'degraded': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'down': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Service Inspector</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNodeId(null)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Basic Info */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <div>
            <Badge className={`${getStatusColor(data.status)} text-white capitalize`}>
              {data.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-name">Service Name</Label>
          <Input 
            id="node-name" 
            value={name} 
            onChange={(e) => handleNameChange(e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="node-desc">Description</Label>
          <Textarea 
            id="node-desc"
            placeholder="Describe the service responsibility..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-4 border-b border-border">
            <TabsList className="w-full justify-start rounded-none border-b-0 p-0 h-auto bg-transparent">
              <TabsTrigger 
                value="config" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Configuration
              </TabsTrigger>
              <TabsTrigger 
                value="runtime" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Runtime
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto bg-muted/10">
            <TabsContent value="config" className="p-4 space-y-6 m-0">
              {/* Synced Controls */}
              <div className="space-y-4 p-4 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between">
                   <Label className="flex items-center gap-2">
                     Memory Limit (MB)
                   </Label>
                   <span className="text-xs text-muted-foreground font-mono">{memory} MB</span>
                </div>
                
                <div className="pt-2">
                  <Slider 
                    value={[memory]} 
                    min={0} 
                    max={4096} 
                    step={64}
                    onValueChange={(vals) => handleMemoryChange(vals[0])}
                    className="py-2"
                  />
                </div>

                <div className="flex items-center gap-2">
                   <Input 
                     type="number" 
                     value={memory} 
                     onChange={(e) => handleMemoryChange(Number(e.target.value))}
                     className="font-mono"
                   />
                </div>
              </div>

               <div className="space-y-2">
                 <Label>CPU Request (Cores)</Label>
                 <Input value={data.config?.cpu} disabled className="bg-muted" /> 
                 <p className="text-xs text-muted-foreground">Managed by orchestration policy</p>
               </div>
            </TabsContent>

            <TabsContent value="runtime" className="p-4 space-y-4 m-0">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-background border rounded-md">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Activity className="h-3 w-3" />
                      <span className="text-xs">Uptime</span>
                    </div>
                    <div className="text-2xl font-mono">{data.runtime?.uptime}%</div>
                 </div>
                 <div className="p-3 bg-background border rounded-md">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Activity className="h-3 w-3" />
                      <span className="text-xs">Requests</span>
                    </div>
                    <div className="text-2xl font-mono">{data.runtime?.requests}</div>
                 </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-background">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete Service
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the 
                <span className="font-semibold text-foreground"> {data.label} </span>
                service node from the graph.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  setNodes((nodes) => nodes.filter((n) => n.id !== selectedNodeId));
                  setSelectedNodeId(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
