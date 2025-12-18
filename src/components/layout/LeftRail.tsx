import { LayoutGrid, Box, Activity, Settings, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeftRailProps {
  className?: string;
}

export function LeftRail({ className }: LeftRailProps) {
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', active: true },
    { icon: Box, label: 'Services', active: false },
    { icon: Database, label: 'Resources', active: false },
    { icon: Activity, label: 'Activity', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <nav className={cn("w-16 border-r border-border bg-background flex flex-col items-center py-4 gap-4 z-10", className)}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant={item.active ? "secondary" : "ghost"}
          size="icon"
          className={cn("rounded-lg", item.active && "bg-secondary text-primary")}
          title={item.label}
        >
          <item.icon className="h-6 w-6" />
        </Button>
      ))}
    </nav>
  );
}
