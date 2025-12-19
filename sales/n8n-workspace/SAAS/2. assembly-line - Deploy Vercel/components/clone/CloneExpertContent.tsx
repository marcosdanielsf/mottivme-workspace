'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useCloneStore } from '@/lib/stores';
import { Card, Button, Badge, IconButton, Input, Progress, Textarea } from '@/components/ui';
import {
  Bot,
  Upload,
  Mic,
  Video,
  FileText,
  Play,
  Pause,
  RefreshCw,
  Check,
  X,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Volume2,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Copy,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Send,
} from '@/components/ui/icons';

// ============================================
// MATERIAL TYPES
// ============================================

interface Material {
  id: string;
  type: 'video' | 'audio' | 'texto' | 'transcricao';
  name: string;
  duration?: string;
  size?: string;
  status: 'processing' | 'ready' | 'error';
  addedAt: string;
}

const mockMaterials: Material[] = [
  { id: '1', type: 'video', name: 'Aula 1 - Introdução.mp4', duration: '45:32', status: 'ready', addedAt: '2024-02-15' },
  { id: '2', type: 'video', name: 'Live - Perguntas e Respostas.mp4', duration: '1:23:45', status: 'ready', addedAt: '2024-02-14' },
  { id: '3', type: 'audio', name: 'Podcast Ep. 47.mp3', duration: '58:12', status: 'ready', addedAt: '2024-02-13' },
  { id: '4', type: 'audio', name: 'Áudio WhatsApp - Dicas.m4a', duration: '3:45', status: 'processing', addedAt: '2024-02-15' },
  { id: '5', type: 'texto', name: 'Posts Instagram (34 posts)', size: '12 KB', status: 'ready', addedAt: '2024-02-12' },
  { id: '6', type: 'texto', name: 'Emails da Lista (156 emails)', size: '89 KB', status: 'ready', addedAt: '2024-02-10' },
  { id: '7', type: 'transcricao', name: 'Transcrição Aula 1', size: '23 KB', status: 'ready', addedAt: '2024-02-15' },
];

// ============================================
// DNA TRAITS
// ============================================

interface DNATrait {
  id: string;
  category: string;
  trait: string;
  examples: string[];
  confidence: number;
}

const mockDNATraits: DNATrait[] = [
  { 
    id: '1', 
    category: 'Tom de Voz', 
    trait: 'Direto e assertivo', 
    examples: ['Olha só...', 'Presta atenção nisso:', 'Vou ser sincero contigo:'],
    confidence: 92,
  },
  { 
    id: '2', 
    category: 'Tom de Voz', 
    trait: 'Usa humor pontual', 
    examples: ['Relaxa que não vai doer (muito)', 'Calma, respira...'],
    confidence: 78,
  },
  { 
    id: '3', 
    category: 'Vocabulário', 
    trait: 'Expressões características', 
    examples: ['Sacou?', 'Faz sentido?', 'Bora lá!', 'Manda bala'],
    confidence: 95,
  },
  { 
    id: '4', 
    category: 'Vocabulário', 
    trait: 'Evita jargões técnicos', 
    examples: ['Ao invés de ROI, fala "retorno"', 'Troca KPI por "meta"'],
    confidence: 88,
  },
  { 
    id: '5', 
    category: 'Estrutura', 
    trait: 'Começa com gancho forte', 
    examples: ['Você sabia que...', 'O maior erro que...', 'Se você...'],
    confidence: 94,
  },
  { 
    id: '6', 
    category: 'Estrutura', 
    trait: 'Usa storytelling pessoal', 
    examples: ['Quando eu comecei...', 'Lembro que uma vez...'],
    confidence: 85,
  },
  { 
    id: '7', 
    category: 'Gatilhos', 
    trait: 'Escassez e urgência', 
    examples: ['Só até amanhã', 'Últimas vagas', 'Não vai ter outra chance'],
    confidence: 91,
  },
];

// ============================================
// CLONE EXPERT CONTENT
// ============================================

export const CloneExpertContent: React.FC = () => {
  const { clone, updateClone, testOutput, setTestOutput } = useCloneStore();
  
  const [activeTab, setActiveTab] = React.useState<'materials' | 'dna' | 'test'>('materials');
  const [isTraining, setIsTraining] = React.useState(false);
  const [testInput, setTestInput] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [materials, setMaterials] = React.useState(mockMaterials);
  const [dnaTraits, setDnaTraits] = React.useState(mockDNATraits);

  // Calculate stats
  const totalVideos = materials.filter(m => m.type === 'video').length;
  const totalAudios = materials.filter(m => m.type === 'audio').length;
  const totalTextos = materials.filter(m => m.type === 'texto').length;
  const processingCount = materials.filter(m => m.status === 'processing').length;

  // Handle training
  const handleStartTraining = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
      updateClone({ quality: Math.min(100, (clone?.quality || 0) + 5) });
    }, 3000);
  };

  // Handle test generation
  const handleTestGenerate = () => {
    if (!testInput.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      setTestOutput(`Olha só, ${testInput.toLowerCase().includes('investir') ? 'sobre investimentos' : 'sobre isso'}...

Vou ser sincero contigo: a maioria das pessoas erra feio nessa parte. Sacou?

Quando eu comecei, também não entendia nada. Mas depois de muito estudo, descobri que o segredo está em 3 pilares simples:

1. Primeiro, você precisa entender SEU momento
2. Depois, criar uma estratégia personalizada
3. E por fim, executar com consistência

Faz sentido pra você? Se quiser, posso te explicar cada um desses pilares em detalhes.

Bora lá! 🚀`);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-3xl">
              🧠
            </div>
            <div className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              (clone?.quality || 78) >= 80 ? 'bg-success' : 'bg-warning'
            )}>
              {clone?.quality || 78}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold">{clone?.name || 'Dr. João Silva'}</h2>
            <p className="text-white/40">Clone Expert • {totalVideos + totalAudios + totalTextos} materiais analisados</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={isTraining ? 'brand' : 'success'}>
            {isTraining ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Treinando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Ativo
              </>
            )}
          </Badge>
          <Button variant="secondary" onClick={handleStartTraining} disabled={isTraining}>
            <RefreshCw className={cn('w-4 h-4', isTraining && 'animate-spin')} />
            Retreinar
          </Button>
          <Button>
            <Sparkles className="w-4 h-4" />
            Usar Clone
          </Button>
        </div>
      </div>

      {/* Quality Meter */}
      <Card className="animate-slide-up stagger-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold">Qualidade do Clone</h4>
            <p className="text-sm text-white/40">Baseado na quantidade e qualidade dos materiais</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gradient">{clone?.quality || 78}%</p>
            <p className="text-xs text-white/40">Meta: 95%</p>
          </div>
        </div>
        
        <Progress value={clone?.quality || 78} size="lg" className="mb-4" />
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white/5">
            <Video className="w-5 h-5 mx-auto mb-1 text-red-400" />
            <p className="text-lg font-bold">{totalVideos}</p>
            <p className="text-xs text-white/40">Vídeos</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <Mic className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <p className="text-lg font-bold">{totalAudios}</p>
            <p className="text-xs text-white/40">Áudios</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <FileText className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <p className="text-lg font-bold">{totalTextos}</p>
            <p className="text-xs text-white/40">Textos</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <Brain className="w-5 h-5 mx-auto mb-1 text-brand-400" />
            <p className="text-lg font-bold">{dnaTraits.length}</p>
            <p className="text-xs text-white/40">Traits DNA</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 animate-slide-up stagger-2">
        {[
          { id: 'materials', label: 'Materiais', icon: Upload },
          { id: 'dna', label: 'DNA Extraído', icon: Brain },
          { id: 'test', label: 'Testar Clone', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all',
              activeTab === tab.id
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'materials' && (
        <MaterialsTab materials={materials} onUpload={() => {}} />
      )}
      
      {activeTab === 'dna' && (
        <DNATab traits={dnaTraits} />
      )}
      
      {activeTab === 'test' && (
        <TestTab 
          input={testInput}
          setInput={setTestInput}
          output={testOutput}
          isGenerating={isGenerating}
          onGenerate={handleTestGenerate}
        />
      )}
    </div>
  );
};

// ============================================
// MATERIALS TAB
// ============================================

interface MaterialsTabProps {
  materials: Material[];
  onUpload: () => void;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({ materials, onUpload }) => {
  const typeConfig = {
    video: { icon: Video, color: 'text-red-400', bg: 'bg-red-500/20' },
    audio: { icon: Mic, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    texto: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    transcricao: { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/20' },
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Upload Area */}
      <Card className="border-dashed border-2 border-white/20 hover:border-brand-500/50 transition-all cursor-pointer group">
        <div className="py-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-brand-500/20 flex items-center justify-center mx-auto mb-4 transition-all">
            <Upload className="w-8 h-8 text-white/40 group-hover:text-brand-400" />
          </div>
          <h4 className="font-semibold mb-1">Adicionar Materiais</h4>
          <p className="text-sm text-white/40 mb-4">
            Arraste arquivos ou clique para selecionar
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/30">
            <Badge>MP4</Badge>
            <Badge>MP3</Badge>
            <Badge>M4A</Badge>
            <Badge>TXT</Badge>
            <Badge>PDF</Badge>
          </div>
        </div>
      </Card>

      {/* Materials List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Materiais ({materials.length})</h4>
          <Input placeholder="Buscar..." className="w-48" icon={<MessageSquare className="w-4 h-4" />} />
        </div>

        <div className="space-y-2">
          {materials.map((material) => {
            const config = typeConfig[material.type];
            return (
              <div
                key={material.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
              >
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.bg)}>
                  <config.icon className={cn('w-5 h-5', config.color)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{material.name}</p>
                  <p className="text-xs text-white/40">
                    {material.duration || material.size} • {material.addedAt}
                  </p>
                </div>

                {material.status === 'processing' ? (
                  <Badge variant="brand">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processando
                  </Badge>
                ) : material.status === 'error' ? (
                  <Badge variant="danger">Erro</Badge>
                ) : (
                  <Badge variant="success">
                    <Check className="w-3 h-3" />
                    Pronto
                  </Badge>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <IconButton size="sm">
                    <Play className="w-4 h-4" />
                  </IconButton>
                  <IconButton size="sm">
                    <Trash2 className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ============================================
// DNA TAB
// ============================================

interface DNATabProps {
  traits: DNATrait[];
}

const DNATab: React.FC<DNATabProps> = ({ traits }) => {
  const categories = [...new Set(traits.map(t => t.category))];

  return (
    <div className="space-y-4 animate-slide-up">
      <Card className="bg-brand-500/10 border-brand-500/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h4 className="font-semibold text-brand-400 mb-1">DNA Psicológico Extraído</h4>
            <p className="text-sm text-white/60">
              A IA analisou seus materiais e identificou {traits.length} características únicas do seu estilo de comunicação.
              Essas traits são usadas para gerar conteúdo que soa exatamente como você.
            </p>
          </div>
        </div>
      </Card>

      {categories.map((category) => (
        <Card key={category}>
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-400" />
            {category}
          </h4>
          
          <div className="space-y-4">
            {traits.filter(t => t.category === category).map((trait) => (
              <div key={trait.id} className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{trait.trait}</p>
                  <Badge variant={trait.confidence >= 90 ? 'success' : trait.confidence >= 80 ? 'brand' : 'default'}>
                    {trait.confidence}% confiança
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {trait.examples.map((example, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/10 text-xs text-white/60">
                      "{example}"
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

// ============================================
// TEST TAB
// ============================================

interface TestTabProps {
  input: string;
  setInput: (value: string) => void;
  output: string | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

const TestTab: React.FC<TestTabProps> = ({ input, setInput, output, isGenerating, onGenerate }) => {
  return (
    <div className="grid grid-cols-2 gap-4 animate-slide-up">
      {/* Input */}
      <Card className="flex flex-col">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-400" />
          Prompt de Teste
        </h4>
        
        <Textarea
          placeholder="Digite um tema ou pergunta para o clone responder...

Ex: Escreva um post sobre como começar a investir com pouco dinheiro"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="flex-1 mb-4"
        />

        <div className="flex gap-2">
          <Button onClick={onGenerate} disabled={!input.trim() || isGenerating} className="flex-1">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar com Clone
              </>
            )}
          </Button>
        </div>

        {/* Quick prompts */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 mb-2">Prompts rápidos:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Post sobre investimentos',
              'Resposta para objeção de preço',
              'Email de boas-vindas',
              'Script de vídeo',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="px-2 py-1 rounded-md bg-white/5 text-xs hover:bg-white/10 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Output */}
      <Card className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5 text-brand-400" />
            Resposta do Clone
          </h4>
          {output && (
            <div className="flex gap-1">
              <IconButton size="sm">
                <Copy className="w-4 h-4" />
              </IconButton>
              <IconButton size="sm">
                <RefreshCw className="w-4 h-4" />
              </IconButton>
            </div>
          )}
        </div>

        {isGenerating ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto mb-3" />
              <p className="text-sm text-white/40">Gerando com a voz do clone...</p>
            </div>
          </div>
        ) : output ? (
          <div className="flex-1 p-4 rounded-lg bg-white/5 overflow-y-auto">
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans">
              {output}
            </pre>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 text-sm">
                Digite um prompt e clique em "Gerar"<br />para testar o clone
              </p>
            </div>
          </div>
        )}

        {output && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 mb-2">O que achou?</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                👍 Ficou bom
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                👎 Precisa ajustar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CloneExpertContent;
