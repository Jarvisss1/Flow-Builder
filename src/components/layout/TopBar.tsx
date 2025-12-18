import { Search, Bell, User, Moon, Sun, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';
import { useAppStore } from '@/store/useAppStore';

export function TopBar() {
  const { setTheme, theme } = useTheme();
  const setMobilePanelOpen = useAppStore((state) => state.actions.setMobilePanelOpen);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={() => setMobilePanelOpen(true)}
        >
          <FolderKanban className="h-5 w-5" />
          <span className="sr-only">Open Apps</span>
        </Button>
        <div className="font-bold text-xl tracking-tight text-primary hidden sm:block">FlowBuilder</div>
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search flows..." 
            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
        </Button>
      </div>
    </header>
  );
}
