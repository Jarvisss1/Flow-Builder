import { create } from 'zustand';

interface AppState {
    selectedAppId: string | null;
    selectedNodeId: string | null;
    isMobilePanelOpen: boolean;
    isInspectorOpen: boolean;
    activeInspectorTab: string;
    actions: {
        setSelectedAppId: (id: string | null) => void;
        setSelectedNodeId: (id: string | null) => void;
        setMobilePanelOpen: (isOpen: boolean) => void;
        setInspectorOpen: (isOpen: boolean) => void;
        setActiveInspectorTab: (tab: string) => void;
    };
}

export const useAppStore = create<AppState>((set) => ({
    selectedAppId: null,
    selectedNodeId: null,
    isMobilePanelOpen: false,
    isInspectorOpen: true,
    activeInspectorTab: 'config',
    actions: {
        setSelectedAppId: (id) => set({ selectedAppId: id }),
        setSelectedNodeId: (id) => set((state) => ({
            selectedNodeId: id,
            // Open mobile panel if a node is selected (optional UX choice, keeping simple for now)
            isMobilePanelOpen: !!id || state.isMobilePanelOpen,
            // Open inspector if closed when selecting a node
            isInspectorOpen: !!id ? true : state.isInspectorOpen
        })),
        setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
        setInspectorOpen: (isOpen) => set({ isInspectorOpen: isOpen }),
        setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
    },
}));

export const useAppActions = () => useAppStore((state) => state.actions);
export const useSelectedAppId = () => useAppStore((state) => state.selectedAppId);
export const useSelectedNodeId = () => useAppStore((state) => state.selectedNodeId);
export const useIsMobilePanelOpen = () => useAppStore((state) => state.isMobilePanelOpen);
export const useActiveInspectorTab = () => useAppStore((state) => state.activeInspectorTab);
