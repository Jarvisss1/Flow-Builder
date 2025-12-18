import type { Edge, Node } from '@xyflow/react';

// Types
export interface App {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
}

export type NodeStatus = 'healthy' | 'degraded' | 'down';

export interface ServiceNodeData extends Record<string, unknown> {
    label: string;
    description?: string;
    type?: 'database' | 'server' | 'client';
    status: NodeStatus;
    config: {
        memory: number;
        cpu: number;
    };
    runtime: {
        uptime: number;
        requests: number;
    };
}

// Mock Data
const APPS: App[] = [
    { id: 'app-1', name: 'E-Commerce Platform', description: 'Main store application', status: 'active' },
    { id: 'app-2', name: 'Analytics Dashboard', description: 'Internal data processing', status: 'active' },
    { id: 'app-3', name: 'Payment Gateway', description: 'Legacy payment system', status: 'inactive' },
];

const GRAPHS: Record<string, { nodes: Node<ServiceNodeData>[]; edges: Edge[] }> = {
    'app-1': {
        nodes: [
            {
                id: '1',
                type: 'service',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Auth Service',
                    type: 'server',
                    status: 'healthy',
                    config: { memory: 512, cpu: 2 },
                    runtime: { uptime: 99.9, requests: 1200 }
                },
            },
            {
                id: '2',
                type: 'service',
                position: { x: 400, y: 100 },
                data: {
                    label: 'User Service',
                    type: 'server',
                    status: 'healthy',
                    config: { memory: 1024, cpu: 4 },
                    runtime: { uptime: 99.5, requests: 3400 }
                },
            },
            {
                id: '3',
                type: 'service',
                position: { x: 250, y: 300 },
                data: {
                    label: 'Database',
                    type: 'database',
                    status: 'degraded',
                    config: { memory: 2048, cpu: 8 },
                    runtime: { uptime: 98.2, requests: 5000 }
                },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3', animated: true },
        ],
    },
    'app-2': {
        nodes: [
            {
                id: '4',
                type: 'service',
                position: { x: 150, y: 150 },
                data: {
                    label: 'Ingestion Service',
                    type: 'client',
                    status: 'healthy',
                    config: { memory: 256, cpu: 1 },
                    runtime: { uptime: 99.99, requests: 800 }
                },
            },
            {
                id: '5',
                type: 'service',
                position: { x: 450, y: 150 },
                data: {
                    label: 'Processing Unit',
                    type: 'server',
                    status: 'down',
                    config: { memory: 4096, cpu: 16 },
                    runtime: { uptime: 0, requests: 0 }
                },
            },
        ],
        edges: [
            { id: 'e4-5', source: '4', target: '5', animated: true },
        ],
    },
    'app-3': {
        nodes: [],
        edges: [],
    }
};

const DELAY = 800; // Simulated latency ms

export const mockApi = {
    getApps: async (): Promise<App[]> => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([...APPS]), DELAY);
        });
    },

    getGraph: async (appId: string): Promise<{ nodes: Node<ServiceNodeData>[]; edges: Edge[] }> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const graph = GRAPHS[appId];
                if (graph) {
                    resolve(JSON.parse(JSON.stringify(graph))); // Return copy
                } else {
                    reject(new Error('Graph not found'));
                }
            }, DELAY);
        });
    }
};
