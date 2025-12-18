import { useAppStore } from '@/store/useAppStore';
import { AppSelector } from './inspector/AppSelector';
import { NodeInspector } from '@/features/inspector/NodeInspector';
import { Separator } from '@/components/ui/separator';

export function RightPanelContent() {
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);

  return (
    <div className="h-full flex flex-col bg-background">
      {!selectedNodeId ? (
        <>
          <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-lg">Inventory</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppSelector />
            <Separator className="my-2" />
            <div className="p-6 text-center text-muted-foreground text-sm">
              Select a node in the canvas to view its properties.
            </div>
          </div>
        </>
      ) : (
        <NodeInspector />
      )}
    </div>
  );
}
