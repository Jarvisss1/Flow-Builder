import { useApps } from '@/hooks/useQueries';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AppSelector() {
  const { data: apps, isLoading } = useApps();
  const selectedAppId = useAppStore((state) => state.selectedAppId);
  const setSelectedAppId = useAppStore((state) => state.actions.setSelectedAppId);

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading apps...</div>;
  }

  return (
    <Card className="border-0 shadow-none rounded-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] w-full px-2">
          <div className="flex flex-col gap-1">
            {apps?.map((app) => (
              <Button
                key={app.id}
                variant={selectedAppId === app.id ? "secondary" : "ghost"}
                className={cn(
                  "justify-start h-auto py-3 px-3 w-full border border-transparent",
                  selectedAppId === app.id && "bg-secondary/50 border-input"
                )}
                onClick={() => setSelectedAppId(app.id)}
              >
                <div className="flex items-start gap-3 text-left w-full">
                  <div className={cn(
                    "p-2 rounded-md shrink-0 transition-colors",
                    selectedAppId === app.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">{app.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{app.description}</div>
                  </div>
                  {selectedAppId === app.id && (
                    <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
