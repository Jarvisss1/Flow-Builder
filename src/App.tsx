import { ReactFlowProvider } from '@xyflow/react';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { FlowCanvas } from '@/features/flow/FlowCanvas';
import { RightPanelContent } from '@/features/RightPanelContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppInner() {
  // Pass the actual component instance to layout
  return (
    <AppLayout rightPanel={<RightPanelContent />}>
      <FlowCanvas />
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ReactFlowProvider>
          <AppInner />
        </ReactFlowProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
