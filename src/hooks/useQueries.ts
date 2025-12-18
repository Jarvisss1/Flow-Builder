import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { App, ServiceNodeData } from '../api/mockApi';
import type { Edge, Node } from '@xyflow/react';

export const useApps = () => {
    return useQuery({
        queryKey: ['apps'],
        queryFn: async (): Promise<App[]> => {
            const res = await fetch('/apps');
            if (!res.ok) throw new Error('Failed to fetch apps');
            return res.json();
        },
    });
};

export const useGraph = (appId: string | null) => {
    return useQuery({
        queryKey: ['graph', appId],
        queryFn: async (): Promise<{ nodes: Node<ServiceNodeData>[]; edges: Edge[] }> => {
            const res = await fetch(`/apps/${appId}/graph`);
            if (!res.ok) throw new Error('Failed to fetch graph');
            return res.json();
        },
        enabled: !!appId, // Only fetch if appId is selected
        staleTime: 5 * 60 * 1000, // Cache for 5 mins
    });
};

export const useUpdateGraph = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ appId, data }: { appId: string; data: { nodes: Node<ServiceNodeData>[]; edges: Edge[] } }) => {
            const res = await fetch(`/apps/${appId}/graph`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update graph');
            return res.json();
        },
        onSuccess: (data, variables) => {
            // Manually update the cache so we don't fetch stale data later
            queryClient.setQueryData(['graph', variables.appId], data);
        }
    });
};
