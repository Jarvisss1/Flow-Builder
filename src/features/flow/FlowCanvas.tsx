import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Node, type Edge, type Connection, type OnNodesChange, type OnEdgesChange, addEdge, applyNodeChanges, applyEdgeChanges, useReactFlow, ReactFlow, Background, Controls, useNodesState, useEdgesState, BackgroundVariant, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAppStore } from '@/store/useAppStore';
import { useGraph } from '@/hooks/useQueries';
import { Loader2, Plus, Minus, Maximize } from 'lucide-react';
import { ServiceNode } from './ServiceNode';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FlowCanvas() {
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedNodeId = useAppStore((state) => state.actions.setSelectedNodeId);
  
  const { data: graphData, isLoading, isError } = useGraph(selectedAppId);
  
  const nodeTypes = useMemo(() => ({
    service: ServiceNode,
  }), []);

  // Local state for ReactFlow interaction
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // Sync with query data
  useEffect(() => {
    if (graphData) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      // Fit view after a tick to allow rendering
      setTimeout(() => fitView({ padding: 0.2 }), 50);
    } // Removed else block to prevent clearing on every re-render or loading state
  }, [graphData, setNodes, setEdges, fitView]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const [simulateError, setSimulateError] = useState(false);

  const addNode = useCallback((type: 'server' | 'database') => {
    const id = `new-${type}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'service',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `New ${type === 'server' ? 'Service' : 'Database'}`,
        type,
        status: 'healthy',
        config: { memory: type === 'database' ? 2048 : 512, cpu: type === 'database' ? 4 : 1 },
        runtime: { uptime: 100, requests: 0 }
      }
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const isInspectorOpen = useAppStore((state) => state.isInspectorOpen);
  const setInspectorOpen = useAppStore((state) => state.actions.setInspectorOpen);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Fit View: Shift + F
      if (e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        fitView({ padding: 0.2 });
      }
      
      // Zoom In: Ctrl + Plus / Equal
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Equal' || e.code === 'NumpadAdd')) {
          e.preventDefault();
          useReactFlow().zoomIn(); // Wait, specific hook needed inside component or instance usage
          // Actually, we can use the instance from useReactFlow() but 'zoomIn' is available on the instance.
          // However, we are inside a component inside ReactFlowProvider (App.tsx), so useReactFlow works.
          // But I already destructured fitView. I need the whole instance or just zoomIn/zoomOut.
      }
      // I will handle Zoom shortcuts in the separate useEffect for cleaner code or just rely on default ReactFlow behavior?
      // ReactFlow has default zoom behaviors (scroll). Explicit keyboard shortcuts for zoom are good too.
      // Let's implement them properly below.
    };
  }, [fitView]);
  
  // Re-implementing shortcuts properly with full access
  const { zoomIn, zoomOut } = useReactFlow();

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        fitView({ padding: 0.2 });
      }
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Equal' || e.code === 'NumpadAdd')) {
        e.preventDefault();
        zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && (e.code === 'Minus' || e.code === 'NumpadSubtract')) {
        e.preventDefault();
        zoomOut();
      }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyB') {
        e.preventDefault();
        setInspectorOpen(!isInspectorOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fitView, zoomIn, zoomOut, isInspectorOpen, setInspectorOpen]);

  if (isLoading && selectedAppId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Loading graph...
      </div>
    );
  }

  if (!selectedAppId) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <div className="mb-4 p-4 rounded-full bg-muted/50">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/50">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Application Selected</h3>
            <p className="max-w-sm text-center">Select an application from the right panel to view its architecture graph.</p>
        </div>
    );
  }

  if (isError || simulateError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive gap-4">
        <p>Error loading graph data.</p>
        <Button variant="outline" onClick={() => setSimulateError(false)}>
            Retry / Clear Error
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        deleteKeyCode={['Backspace', 'Delete']}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#aaa" />
        <CustomControls />
      </ReactFlow>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 items-end">
         <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border shadow-sm mb-2">
             <Switch id="error-mode" checked={simulateError} onCheckedChange={setSimulateError} />
             <Label htmlFor="error-mode" className="text-xs">Simulate Error</Label>
         </div>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="shadow-lg gap-2">
                    <Plus className="h-4 w-4" />
                    Add Node
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => addNode('server')}>
                    Service Node
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNode('database')}>
                    Database Node
                </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
    </div>
  );
}

function CustomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <Panel position="bottom-left" className="flex gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => zoomIn()} className="h-8 w-8 bg-background">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Zoom In (Ctrl + +)
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => zoomOut()} className="h-8 w-8 bg-background">
                            <Minus className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Zoom Out (Ctrl + -)
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => fitView({ padding: 0.2 })} className="h-8 w-8 bg-background">
                            <Maximize className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        Fit View (Shift + F)
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Panel>
    );
}
