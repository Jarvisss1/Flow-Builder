import { type ReactNode } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TopBar } from './TopBar';
import { LeftRail } from './LeftRail';
import { useIsMobile } from '@/hooks/useIsMobile';

interface AppLayoutProps {
  children: ReactNode;
  rightPanel: ReactNode;
}

export function AppLayout({ children, rightPanel }: AppLayoutProps) {
  const isMobilePanelOpen = useAppStore((state) => state.isMobilePanelOpen);
  const setMobilePanelOpen = useAppStore((state) => state.actions.setMobilePanelOpen);
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden relative">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftRail className="hidden sm:flex" />
        
        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950/50">
           {children}
        </main>

        {/* Right Panel - Desktop (Sidebar) */}
        <aside className="hidden lg:flex w-80 border-l border-border bg-background flex-col shadow-sm z-10">
          {rightPanel}
        </aside>

        {/* Right Panel - Mobile/Tablet (Drawer) */}
        {isMobile && (
          <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
            <SheetContent side="right" className="p-0 w-[400px] sm:w-[500px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Inspector</SheetTitle>
                <SheetDescription>Service Inspector Panel</SheetDescription>
              </SheetHeader>
              <div className="h-full flex flex-col">
                {rightPanel}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
}
