'use client';

import * as React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { cn } from '@/lib/utils';
import { Card, Button, Badge, IconButton, Input } from '@/components/ui';
import {
  Plus,
  Save,
  Play,
  Pause,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  MessageSquare,
  Zap,
  Target,
  Search,
  DollarSign,
  Clock,
  Video,
  Mic,
  FileText,
  Users,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Copy,
  Edit3,
  X,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Instagram,
} from '@/components/ui/icons';

// ============================================
// NODE DATA TYPES
// ============================================

interface EtapaData {
  [key: string]: unknown;
  tipo: 'abordagem' | 'ativacao' | 'qualificacao' | 'sondagem' | 'pitch';
  titulo: string;
  mensagem: string;
  canal: 'instagram' | 'whatsapp' | 'email';
  delay?: string;
  hasRescue?: boolean;
}

interface RescueData {
  [key: string]: unknown;
  tipo: 'audio' | 'video' | 'texto';
  conteudo: string;
  delay: string;
}

// ============================================
// ETAPA CONFIG
// ============================================

const etapaConfig = {
  abordagem: { icon: MessageSquare, color: 'from-blue-500 to-cyan-500', label: 'Abordagem', emoji: '👋' },
  ativacao: { icon: Zap, color: 'from-yellow-500 to-orange-500', label: 'Ativação', emoji: '⚡' },
  qualificacao: { icon: Target, color: 'from-green-500 to-emerald-500', label: 'Qualificação', emoji: '🎯' },
  sondagem: { icon: Search, color: 'from-purple-500 to-pink-500', label: 'Sondagem', emoji: '🔍' },
  pitch: { icon: DollarSign, color: 'from-brand-500 to-blue-500', label: 'Pitch', emoji: '💰' },
};

const canalConfig = {
  instagram: { icon: Instagram, color: 'text-pink-400', label: 'Instagram' },
  whatsapp: { icon: Phone, color: 'text-green-400', label: 'WhatsApp' },
  email: { icon: Mail, color: 'text-blue-400', label: 'Email' },
};

// ============================================
// CUSTOM NODES
// ============================================

const EtapaNode: React.FC<{ data: EtapaData; selected: boolean }> = ({ data, selected }) => {
  const config = etapaConfig[data.tipo];
  const canal = canalConfig[data.canal];
  const Icon = config.icon;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-3 !h-3 !border-2 !border-white/40" />
      
      <div className={cn(
        'w-[280px] rounded-xl overflow-hidden transition-all duration-200',
        'bg-surface-glass backdrop-blur-xl border',
        selected ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105' : 'border-white/10 hover:border-white/20'
      )}>
        {/* Header */}
        <div className={cn('px-4 py-3 bg-gradient-to-r', config.color)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{config.emoji}</span>
              <span className="font-semibold text-white text-sm">{config.label}</span>
            </div>
            <div className={cn('p-1.5 rounded-lg bg-black/20', canal.color)}>
              <canal.icon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-medium text-white mb-2 text-sm">{data.titulo}</h4>
          <p className="text-xs text-white/50 line-clamp-2 mb-3">{data.mensagem}</p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            {data.delay && (
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Clock className="w-3 h-3" />
                {data.delay}
              </div>
            )}
            {data.hasRescue && (
              <Badge variant="warning" className="text-2xs">
                <AlertCircle className="w-3 h-3" />
                Rescue
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Handles para saídas */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="respondeu"
        className="!bg-success !w-3 !h-3 !border-2 !border-white/40 !left-[30%]" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="nao_respondeu"
        className="!bg-danger !w-3 !h-3 !border-2 !border-white/40 !left-[70%]" 
      />
    </>
  );
};

const RescueNode: React.FC<{ data: RescueData; selected: boolean }> = ({ data, selected }) => {
  const tipoConfig = {
    audio: { icon: Mic, color: 'text-orange-400', label: 'Áudio' },
    video: { icon: Video, color: 'text-red-400', label: 'Vídeo' },
    texto: { icon: FileText, color: 'text-blue-400', label: 'Texto' },
  };
  const tipo = tipoConfig[data.tipo];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-3 !h-3 !border-2 !border-white/40" />
      
      <div className={cn(
        'w-[200px] rounded-xl overflow-hidden transition-all',
        'bg-warning/10 backdrop-blur-xl border',
        selected ? 'border-warning ring-2 ring-warning/30' : 'border-warning/30'
      )}>
        <div className="px-3 py-2 bg-warning/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-xs font-semibold text-warning">RESCUE</span>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <tipo.icon className={cn('w-4 h-4', tipo.color)} />
            <span className="text-xs text-white/60">{tipo.label}</span>
            <span className="text-xs text-white/40 ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.delay}
            </span>
          </div>
          <p className="text-xs text-white/50 line-clamp-2">{data.conteudo}</p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-3 !h-3 !border-2 !border-white/40" />
    </>
  );
};

const StartNode: React.FC = () => (
  <>
    <div className="w-[120px] h-[50px] rounded-full bg-gradient-to-r from-brand-500 to-blue-500 flex items-center justify-center shadow-glow">
      <span className="font-semibold text-white text-sm">INÍCIO</span>
    </div>
    <Handle type="source" position={Position.Bottom} className="!bg-brand-500 !w-3 !h-3 !border-2 !border-white/40" />
  </>
);

const EndNode: React.FC<{ data: { label: string } }> = ({ data }) => (
  <>
    <Handle type="target" position={Position.Top} className="!bg-white/20 !w-3 !h-3 !border-2 !border-white/40" />
    <div className="w-[140px] h-[50px] rounded-full bg-gradient-to-r from-success to-emerald-500 flex items-center justify-center">
      <span className="font-semibold text-white text-sm">{data.label}</span>
    </div>
  </>
);

// Node types registry
const nodeTypes: NodeTypes = {
  etapa: EtapaNode,
  rescue: RescueNode,
  start: StartNode,
  end: EndNode,
};

// ============================================
// CUSTOM EDGES
// ============================================

const edgeStyles = {
  respondeu: { stroke: '#22c55e', strokeWidth: 2 },
  nao_respondeu: { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' },
  default: { stroke: '#8b5cf6', strokeWidth: 2 },
};

// ============================================
// INITIAL DATA
// ============================================

const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    position: { x: 400, y: 50 },
    data: {},
  },
  {
    id: 'abordagem',
    type: 'etapa',
    position: { x: 350, y: 150 },
    data: {
      tipo: 'abordagem',
      titulo: 'Mensagem Inicial',
      mensagem: 'Oi! Vi que você se interessou por [tema]. Posso te ajudar?',
      canal: 'instagram',
      delay: 'Imediato',
      hasRescue: true,
    } as EtapaData,
  },
  {
    id: 'rescue1',
    type: 'rescue',
    position: { x: 650, y: 280 },
    data: {
      tipo: 'audio',
      conteudo: 'Ei, tudo bem? Vi que você não respondeu...',
      delay: '24h',
    } as RescueData,
  },
  {
    id: 'ativacao',
    type: 'etapa',
    position: { x: 350, y: 380 },
    data: {
      tipo: 'ativacao',
      titulo: 'Ativação do Lead',
      mensagem: 'Que legal! Deixa eu te fazer uma pergunta rápida pra entender melhor sua situação...',
      canal: 'instagram',
      delay: 'Após resposta',
    } as EtapaData,
  },
  {
    id: 'qualificacao',
    type: 'etapa',
    position: { x: 350, y: 600 },
    data: {
      tipo: 'qualificacao',
      titulo: 'Qualificação',
      mensagem: 'Entendi! E qual seu maior desafio hoje em relação a [problema]?',
      canal: 'whatsapp',
      delay: '2h',
      hasRescue: true,
    } as EtapaData,
  },
  {
    id: 'sondagem',
    type: 'etapa',
    position: { x: 350, y: 820 },
    data: {
      tipo: 'sondagem',
      titulo: 'Descoberta de Necessidades',
      mensagem: 'Se eu te mostrasse uma forma de resolver isso em X dias, faria sentido pra você?',
      canal: 'whatsapp',
      delay: 'Após resposta',
    } as EtapaData,
  },
  {
    id: 'pitch',
    type: 'etapa',
    position: { x: 350, y: 1040 },
    data: {
      tipo: 'pitch',
      titulo: 'Apresentação da Oferta',
      mensagem: 'Perfeito! Tenho algo que vai te ajudar: [Oferta]. Quer conhecer os detalhes?',
      canal: 'whatsapp',
      delay: 'Imediato',
    } as EtapaData,
  },
  {
    id: 'end-venda',
    type: 'end',
    position: { x: 250, y: 1220 },
    data: { label: '💰 VENDA' },
  },
  {
    id: 'end-nurture',
    type: 'end',
    position: { x: 500, y: 1220 },
    data: { label: '📧 NURTURE' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-start', source: 'start', target: 'abordagem', type: 'smoothstep', style: edgeStyles.default },
  { id: 'e-abordagem-ok', source: 'abordagem', sourceHandle: 'respondeu', target: 'ativacao', type: 'smoothstep', style: edgeStyles.respondeu, label: 'Respondeu', labelStyle: { fill: '#22c55e', fontSize: 10 } },
  { id: 'e-abordagem-no', source: 'abordagem', sourceHandle: 'nao_respondeu', target: 'rescue1', type: 'smoothstep', style: edgeStyles.nao_respondeu, animated: true, label: 'Não respondeu', labelStyle: { fill: '#ef4444', fontSize: 10 } },
  { id: 'e-rescue1', source: 'rescue1', target: 'ativacao', type: 'smoothstep', style: edgeStyles.default },
  { id: 'e-ativacao-ok', source: 'ativacao', sourceHandle: 'respondeu', target: 'qualificacao', type: 'smoothstep', style: edgeStyles.respondeu },
  { id: 'e-qualificacao-ok', source: 'qualificacao', sourceHandle: 'respondeu', target: 'sondagem', type: 'smoothstep', style: edgeStyles.respondeu },
  { id: 'e-sondagem-ok', source: 'sondagem', sourceHandle: 'respondeu', target: 'pitch', type: 'smoothstep', style: edgeStyles.respondeu },
  { id: 'e-pitch-ok', source: 'pitch', sourceHandle: 'respondeu', target: 'end-venda', type: 'smoothstep', style: edgeStyles.respondeu },
  { id: 'e-pitch-no', source: 'pitch', sourceHandle: 'nao_respondeu', target: 'end-nurture', type: 'smoothstep', style: edgeStyles.nao_respondeu },
];

// ============================================
// ADD NODE PANEL
// ============================================

interface AddNodePanelProps {
  onAdd: (type: string, data: any) => void;
  onClose: () => void;
}

const AddNodePanel: React.FC<AddNodePanelProps> = ({ onAdd, onClose }) => {
  return (
    <div className="absolute top-16 left-4 z-10 w-[280px] glass rounded-xl p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Adicionar Etapa</h4>
        <IconButton size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </IconButton>
      </div>

      <div className="space-y-2">
        {Object.entries(etapaConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onAdd('etapa', { tipo: key, titulo: `Nova ${config.label}`, mensagem: '', canal: 'instagram' })}
            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3 text-left group"
          >
            <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', config.color)}>
              <span className="text-lg">{config.emoji}</span>
            </div>
            <div>
              <p className="font-medium text-sm">{config.label}</p>
              <p className="text-xs text-white/40">Etapa do funil</p>
            </div>
          </button>
        ))}

        <div className="border-t border-white/10 my-3" />

        <button
          onClick={() => onAdd('rescue', { tipo: 'audio', conteudo: '', delay: '24h' })}
          className="w-full p-3 rounded-lg bg-warning/10 hover:bg-warning/20 border border-warning/30 transition-all flex items-center gap-3 text-left"
        >
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="font-medium text-sm text-warning">Rescue</p>
            <p className="text-xs text-white/40">Follow-up automático</p>
          </div>
        </button>
      </div>
    </div>
  );
};

// ============================================
// VORTEX EDITOR
// ============================================

export const VortexEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showAddPanel, setShowAddPanel] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  // Handle new connections
  const onConnect = React.useCallback((connection: Connection) => {
    const edge: Edge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}-${Date.now()}`,
      type: 'smoothstep',
      style: connection.sourceHandle === 'respondeu' ? edgeStyles.respondeu : edgeStyles.nao_respondeu,
      animated: connection.sourceHandle === 'nao_respondeu',
    } as Edge;
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  // Add new node
  const handleAddNode = (type: string, data: any) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 400, y: 200 },
      data,
    };
    setNodes((nds) => [...nds, newNode]);
    setShowAddPanel(false);
  };

  // Handle node selection
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0f]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Background */}
        <Background color="#ffffff10" gap={20} size={1} />
        
        {/* Controls */}
        <Controls 
          className="!bg-surface-glass !border-white/10 !rounded-lg overflow-hidden [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-white/60 [&>button:hover]:!bg-white/10"
          showInteractive={false}
        />
        
        {/* MiniMap */}
        <MiniMap 
          className="!bg-surface-glass !border-white/10 !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'start') return '#8b5cf6';
            if (node.type === 'end') return '#22c55e';
            if (node.type === 'rescue') return '#f59e0b';
            return '#3b82f6';
          }}
          maskColor="rgba(0,0,0,0.8)"
        />

        {/* Top Toolbar */}
        <Panel position="top-left" className="flex items-center gap-2">
          <Button onClick={() => setShowAddPanel(!showAddPanel)}>
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
          
          <div className="h-8 w-px bg-white/10" />
          
          <IconButton className="glass">
            <Undo2 className="w-4 h-4" />
          </IconButton>
          <IconButton className="glass">
            <Redo2 className="w-4 h-4" />
          </IconButton>
          
          <div className="h-8 w-px bg-white/10" />

          <Badge variant="success" className="glass">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-1" />
            Salvo
          </Badge>
        </Panel>

        {/* Right Toolbar */}
        <Panel position="top-right" className="flex items-center gap-2">
          <Button variant="secondary">
            <Play className="w-4 h-4" />
            Simular
          </Button>
          <Button>
            <Sparkles className="w-4 h-4" />
            Publicar
          </Button>
        </Panel>

        {/* Stats Panel */}
        <Panel position="bottom-left">
          <div className="glass rounded-lg p-3 flex items-center gap-4 text-xs">
            <div>
              <span className="text-white/40">Etapas:</span>{' '}
              <span className="font-semibold">{nodes.filter(n => n.type === 'etapa').length}</span>
            </div>
            <div>
              <span className="text-white/40">Rescues:</span>{' '}
              <span className="font-semibold">{nodes.filter(n => n.type === 'rescue').length}</span>
            </div>
            <div>
              <span className="text-white/40">Conexões:</span>{' '}
              <span className="font-semibold">{edges.length}</span>
            </div>
          </div>
        </Panel>

        {/* Add Panel */}
        {showAddPanel && (
          <AddNodePanel onAdd={handleAddNode} onClose={() => setShowAddPanel(false)} />
        )}
      </ReactFlow>
    </div>
  );
};

export default VortexEditor;
