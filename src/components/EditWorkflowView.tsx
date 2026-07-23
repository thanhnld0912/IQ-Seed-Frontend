import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Save, Trash2, Play, FolderOpen, Loader2 } from "lucide-react";
import { workflowsApi, type WorkflowDto } from "../api/workflows";

interface EditWorkflowViewProps {
  onNavigate: (tab: string) => void;
}

/** Các bước có thể đưa vào workflow — map thẳng sang API đã có. */
const STEP_TYPES = [
  { type: 'script', label: 'Kịch bản', icon: '📝', color: '#6bbf3a', hint: 'Sinh/nạp kịch bản phân cảnh' },
  { type: 'character', label: 'Nhân vật', icon: '🎭', color: '#C792E0', hint: 'Ảnh tham chiếu giữ nhân vật nhất quán' },
  { type: 'scene', label: 'Vẽ cảnh', icon: '🖼️', color: '#4bafff', hint: 'Sinh ảnh từng cảnh theo nhân vật' },
  { type: 'voice', label: 'Lồng giọng', icon: '🎙️', color: '#FF9F40', hint: 'TTS cho từng cảnh' },
  { type: 'music', label: 'Nhạc nền', icon: '🎵', color: '#F48FB1', hint: 'Nhạc nền cho cả phim' },
  { type: 'export', label: 'Xuất MP4', icon: '🎬', color: '#dba110', hint: 'Ghép tất cả thành 1 file' },
] as const;

const stepOf = (type: string) => STEP_TYPES.find((s) => s.type === type) ?? STEP_TYPES[0];

function makeNode(type: string, index: number): Node {
  const s = stepOf(type);
  return {
    id: `${type}-${Date.now()}-${index}`,
    position: { x: 60 + index * 240, y: 120 },
    data: { label: `${s.icon} ${s.label}`, stepType: type },
    style: {
      background: '#fff',
      border: `2px solid ${s.color}`,
      borderRadius: 16,
      padding: '10px 14px',
      fontWeight: 800,
      fontSize: 12,
      width: 170,
    },
  };
}

/** Workflow mặc định — đúng thứ tự pipeline thật của sản phẩm. */
function defaultGraph(): { nodes: Node[]; edges: Edge[] } {
  const types = ['script', 'character', 'scene', 'voice', 'export'];
  const nodes = types.map((t, i) => makeNode(t, i));
  const edges: Edge[] = nodes.slice(1).map((n, i) => ({
    id: `e-${nodes[i].id}-${n.id}`,
    source: nodes[i].id,
    target: n.id,
    animated: true,
  }));
  return { nodes, edges };
}

export default function EditWorkflowView({ onNavigate }: EditWorkflowViewProps) {
  const initial = defaultGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selected, setSelected] = useState<Node | null>(null);
  const [name, setName] = useState("Workflow của bé");
  const [saved, setSaved] = useState<WorkflowDto[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    workflowsApi.list().then((r) => setSaved(r.workflows)).catch(() => {});
  }, []);

  const onConnect = useCallback((c: Connection) => setEdges((e) => addEdge({ ...c, animated: true }, e)), [setEdges]);

  /** Thêm bước mới vào cuối. */
  const addStep = (type: string) => {
    const n = makeNode(type, nodes.length);
    setNodes((ns) => [...ns, n]);
    const last = nodes[nodes.length - 1];
    if (last) setEdges((es) => [...es, { id: `e-${last.id}-${n.id}`, source: last.id, target: n.id, animated: true }]);
  };

  /** Chèn 1 bước vào GIỮA cạnh đang chọn (nút "+" giữa 2 node). */
  const insertOnEdge = (edgeId: string, type: string) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;
    const n = makeNode(type, nodes.length);
    setNodes((ns) => [...ns, n]);
    setEdges((es) => [
      ...es.filter((e) => e.id !== edgeId),
      { id: `e-${edge.source}-${n.id}`, source: edge.source, target: n.id, animated: true },
      { id: `e-${n.id}-${edge.target}`, source: n.id, target: edge.target, animated: true },
    ]);
  };

  const deleteSelected = () => {
    if (!selected) return;
    setNodes((ns) => ns.filter((n) => n.id !== selected.id));
    setEdges((es) => es.filter((e) => e.source !== selected.id && e.target !== selected.id));
    setSelected(null);
  };

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const graph = { nodes, edges };
      const r = currentId
        ? await workflowsApi.update(currentId, name, graph)
        : await workflowsApi.create(name, graph);
      setCurrentId(r.id);
      setSaved((s) => [r, ...s.filter((x) => x.id !== r.id)]);
      setMsg('Đã lưu workflow!');
    } catch (e) {
      setMsg('Lỗi lưu: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const load = (w: WorkflowDto) => {
    setNodes(w.graph.nodes ?? []);
    setEdges(w.graph.edges ?? []);
    setName(w.name);
    setCurrentId(w.id);
    setSelected(null);
    setMsg(`Đã mở "${w.name}"`);
  };

  const remove = async (id: string) => {
    if (!confirm('Xóa workflow này?')) return;
    await workflowsApi.remove(id).catch(() => {});
    setSaved((s) => s.filter((x) => x.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  const selectedStep = selected ? stepOf(String(selected.data?.stepType ?? '')) : null;

  return (
    <div className="min-h-screen bg-[#FFFDF7] pb-24 md:pb-12 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2d6c00] font-heading">🔀 Workflow Kịch Bản</h1>
            <p className="text-sm text-on-surface-variant font-medium">
              Kéo-thả các bước, nối chúng lại, chèn bước ở giữa và lưu thành mẫu dùng lại.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-xl text-sm font-bold" />
            <button onClick={save} disabled={busy}
              className="px-5 py-2.5 bg-[#2d6c00] text-white rounded-full text-xs font-extrabold flex items-center gap-1.5 disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Lưu mẫu
            </button>
          </div>
        </div>

        {msg && <div className="bg-[#6bbf3a]/15 border border-[#6bbf3a]/30 text-[#2d6c00] px-4 py-2 rounded-xl text-xs font-bold">{msg}</div>}

        {/* Thanh thêm bước */}
        <div className="bg-white p-4 rounded-2xl border border-surface-container flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-outline font-black uppercase mr-1">Thêm bước:</span>
          {STEP_TYPES.map((s) => (
            <button key={s.type} onClick={() => addStep(s.type)} title={s.hint}
              className="px-3 py-1.5 rounded-full text-[11px] font-extrabold border-2 hover:bg-surface-container transition-colors"
              style={{ borderColor: s.color }}>
              <Plus className="w-3 h-3 inline mr-0.5" />{s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Canvas kéo-thả */}
          <div className="lg:col-span-9 bg-white rounded-3xl border-2 border-surface-container shadow-sm overflow-hidden" style={{ height: 520 }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, n) => setSelected(n)}
              onPaneClick={() => setSelected(null)}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap pannable zoomable />
            </ReactFlow>
          </div>

          {/* Panel bên phải */}
          <div className="lg:col-span-3 space-y-4">
            {/* Chèn bước vào giữa */}
            <div className="bg-white p-4 rounded-2xl border border-surface-container space-y-2">
              <h3 className="text-xs font-black text-on-surface-variant uppercase">Chèn bước vào giữa</h3>
              {edges.length === 0 && <p className="text-[11px] text-outline font-bold">Chưa có kết nối nào.</p>}
              {edges.map((e) => {
                const from = nodes.find((n) => n.id === e.source);
                const to = nodes.find((n) => n.id === e.target);
                if (!from || !to) return null;
                return (
                  <details key={e.id} className="border border-surface-container rounded-xl p-2">
                    <summary className="text-[11px] font-bold text-outline cursor-pointer">
                      {String(from.data?.label)} → {String(to.data?.label)}
                    </summary>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {STEP_TYPES.map((s) => (
                        <button key={s.type} onClick={() => insertOnEdge(e.id, s.type)}
                          className="px-2 py-1 rounded-lg text-[10px] font-extrabold border hover:bg-surface-container"
                          style={{ borderColor: s.color }}>
                          + {s.icon}
                        </button>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            {/* Bước đang chọn */}
            <div className="bg-white p-4 rounded-2xl border border-surface-container space-y-2">
              <h3 className="text-xs font-black text-on-surface-variant uppercase">Bước đang chọn</h3>
              {selectedStep ? (
                <>
                  <p className="text-sm font-black">{selectedStep.icon} {selectedStep.label}</p>
                  <p className="text-[11px] text-outline font-medium">{selectedStep.hint}</p>
                  <button onClick={deleteSelected}
                    className="w-full py-2 border-2 border-red-100 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Xóa bước
                  </button>
                </>
              ) : (
                <p className="text-[11px] text-outline font-bold">Bấm vào 1 bước trên sơ đồ.</p>
              )}
            </div>

            {/* Mẫu đã lưu */}
            <div className="bg-white p-4 rounded-2xl border border-surface-container space-y-2">
              <h3 className="text-xs font-black text-on-surface-variant uppercase flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5" /> Mẫu đã lưu
              </h3>
              {saved.length === 0 && <p className="text-[11px] text-outline font-bold">Chưa có mẫu nào.</p>}
              {saved.map((w) => (
                <div key={w.id} className="flex items-center gap-1">
                  <button onClick={() => load(w)}
                    className="flex-1 text-left px-2 py-1.5 rounded-lg text-[11px] font-bold hover:bg-surface-container truncate">
                    {w.name}
                  </button>
                  <button onClick={() => remove(w.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => onNavigate('workspace')}
              className="w-full py-3 bg-gradient-to-r from-[#F5B82E] to-[#FF9F40] text-white rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5">
              <Play className="w-4 h-4" /> Chạy: mở Gieo Hạt Giống
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
