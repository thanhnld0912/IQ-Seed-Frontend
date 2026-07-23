import { apiGet, apiPost, apiPut, apiDelete } from './client';

/** Graph workflow: node cấu hình + cạnh nối. Lưu nguyên vào BE để tái sử dụng. */
export interface WorkflowGraph {
  nodes: any[];
  edges: any[];
}

export interface WorkflowDto {
  id: string;
  name: string;
  graph: WorkflowGraph;
  createdAt: string;
  updatedAt: string;
}

export const workflowsApi = {
  list: () => apiGet<{ workflows: WorkflowDto[] }>('/api/workflows'),
  create: (name: string, graph: WorkflowGraph) => apiPost<WorkflowDto>('/api/workflows', { name, graph }),
  update: (id: string, name: string, graph: WorkflowGraph) =>
    apiPut<WorkflowDto>(`/api/workflows/${id}`, { name, graph }),
  remove: (id: string) => apiDelete<{ ok: boolean }>(`/api/workflows/${id}`),
};
