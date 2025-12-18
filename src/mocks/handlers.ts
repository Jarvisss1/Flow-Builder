import { http, HttpResponse, delay } from 'msw'
import type { App, ServiceNodeData } from '../api/mockApi'
import type { Edge, Node } from '@xyflow/react'

// --- Reusing the Mock Data from mockApi.ts for now, but moving it here ---

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
        nodes: [
            {
                id: '6',
                type: 'service',
                position: { x: 100, y: 100 },
                data: {
                    label: 'Payment API',
                    type: 'server',
                    status: 'healthy',
                    config: { memory: 1024, cpu: 2 },
                    runtime: { uptime: 99.95, requests: 5000 }
                },
            },
            {
                id: '7',
                type: 'service',
                position: { x: 400, y: 100 },
                data: {
                    label: 'Risk Analysis',
                    type: 'server',
                    status: 'healthy',
                    config: { memory: 2048, cpu: 4 },
                    runtime: { uptime: 99.9, requests: 4800 }
                },
            },
            {
                id: '8',
                type: 'service',
                position: { x: 400, y: 300 },
                data: {
                    label: 'Transaction Logger',
                    type: 'server',
                    status: 'degraded',
                    config: { memory: 512, cpu: 1 },
                    runtime: { uptime: 98.5, requests: 4800 }
                },
            },
            {
                id: '9',
                type: 'service',
                position: { x: 100, y: 300 },
                data: {
                    label: 'Payment DB',
                    type: 'database',
                    status: 'healthy',
                    config: { memory: 4096, cpu: 8 },
                    runtime: { uptime: 99.99, requests: 12000 }
                },
            },
        ],
        edges: [
            { id: 'e6-7', source: '6', target: '7', animated: true },
            { id: 'e7-8', source: '7', target: '8', animated: true },
            { id: 'e8-9', source: '8', target: '9', animated: true },
        ],
    }
};

export const handlers = [
    http.get('/apps', async () => {
        await delay(800);
        return HttpResponse.json(APPS);
    }),

    http.get<{ appId: string }>('/apps/:appId/graph', async ({ params }) => {
        await delay(800);
        const { appId } = params;
        const graph = GRAPHS[appId];

        if (graph) {
            return HttpResponse.json(graph);
        }

        return new HttpResponse(null, { status: 404 });
    }),

    http.put<{ appId: string }, { nodes: Node<ServiceNodeData>[]; edges: Edge[] }>('/apps/:appId/graph', async ({ params, request }) => {
        await delay(500);
        const { appId } = params;
        const body = await request.json();

        if (GRAPHS[appId]) {
            GRAPHS[appId] = body;
            return HttpResponse.json(body);
        }

        return new HttpResponse(null, { status: 404 });
    }),
]
