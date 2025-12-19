'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppStore, useProjectsStore } from '@/lib/stores';
import { Card, Button, Badge, Progress, Avatar, IconButton, Input } from '@/components/ui';
import {
  Send,
  Sparkles,
  Mic,
  Paperclip,
  ChevronRight,
  Check,
  Loader2,
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  MessageSquare,
  Brain,
  Zap,
  Play,
} from '@/components/ui/icons';

// ============================================
// BRIEFING QUESTIONS CONFIG
// ============================================

interface BriefingQuestion {
  id: string;
  question: string;
  subtext?: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'choice' | 'multiselect';
  choices?: string[];
  icon: React.ReactNode;
  aiSuggestions?: string[];
}

const briefingQuestions: BriefingQuestion[] = [
  {
    id: 'product',
    question: 'O que você vende?',
    subtext: 'Descreva seu produto ou serviço principal',
    placeholder: 'Ex: Curso de investimentos, mentoria de emagrecimento, consultoria de marketing...',
    type: 'textarea',
    icon: <Target className="w-5 h-5" />,
    aiSuggestions: ['Curso online', 'Mentoria', 'Consultoria', 'Serviço', 'Produto físico'],
  },
  {
    id: 'avatar',
    question: 'Quem é seu cliente ideal?',
    subtext: 'Descreva a pessoa que mais precisa do que você oferece',
    placeholder: 'Ex: Homens de 30-45 anos, empreendedores que querem escalar...',
    type: 'textarea',
    icon: <Users className="w-5 h-5" />,
    aiSuggestions: ['Empresários', 'Profissionais liberais', 'Mães', 'Jovens adultos', 'Aposentados'],
  },
  {
    id: 'pain',
    question: 'Qual é a maior dor do seu cliente?',
    subtext: 'O problema que tira o sono dele à noite',
    placeholder: 'Ex: Não consegue emagrecer, está endividado, não tem tempo...',
    type: 'textarea',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'desire',
    question: 'O que ele mais deseja?',
    subtext: 'O resultado dos sonhos que ele quer alcançar',
    placeholder: 'Ex: Liberdade financeira, corpo definido, mais tempo com a família...',
    type: 'textarea',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'transformation',
    question: 'Qual transformação você entrega?',
    subtext: 'Do ponto A ao ponto B - o antes e depois',
    placeholder: 'Ex: De endividado para investidor, de sedentário para atleta...',
    type: 'textarea',
    icon: <ArrowLeft className="w-5 h-5 rotate-180" />,
  },
  {
    id: 'differentiator',
    question: 'O que te diferencia dos concorrentes?',
    subtext: 'Seu método único, experiência ou abordagem especial',
    placeholder: 'Ex: Método próprio, 10 anos de experiência, garantia de resultado...',
    type: 'textarea',
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: 'price',
    question: 'Qual o ticket do seu produto principal?',
    subtext: 'Valor que você cobra ou pretende cobrar',
    placeholder: 'Ex: R$ 997, R$ 2.997, R$ 12.000...',
    type: 'text',
    icon: <DollarSign className="w-5 h-5" />,
    aiSuggestions: ['R$ 297', 'R$ 497', 'R$ 997', 'R$ 1.997', 'R$ 2.997', 'R$ 4.997', 'R$ 12.000+'],
  },
  {
    id: 'funnel_type',
    question: 'Qual tipo de funil você quer criar?',
    subtext: 'Escolha o modelo que faz mais sentido para seu negócio',
    type: 'choice',
    placeholder: '',
    icon: <MessageSquare className="w-5 h-5" />,
    choices: ['Funil Vortex (Conversação)', 'High Ticket (Call)', 'Lançamento', 'Perpétuo', 'VSL + Vendas'],
  },
];

// ============================================
// MESSAGE TYPES
// ============================================

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
  questionId?: string;
  isTyping?: boolean;
}

// ============================================
// BRIEFING CONTENT
// ============================================

export const BriefingContent: React.FC = () => {
  const { setActiveTab } = useAppStore();
  const { addProject } = useProjectsStore();
  
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = React.useState(false);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const currentQuestion = briefingQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / briefingQuestions.length) * 100;

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  React.useEffect(() => {
    const timer = setTimeout(() => {
      addAIMessage(
        `Olá! 👋 Eu sou a IA do Assembly Line. Vou te fazer algumas perguntas para entender seu negócio e criar uma estratégia completa pra você.\n\nVamos começar?`,
        undefined,
        1000
      );
      
      setTimeout(() => {
        addAIMessage(
          currentQuestion.question,
          currentQuestion.id,
          500
        );
      }, 2000);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Add AI message with typing effect
  const addAIMessage = (content: string, questionId?: string, delay: number = 0) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content,
        timestamp: new Date(),
        questionId,
      }]);
    }, delay + 1000 + Math.random() * 500);
  };

  // Handle user send message
  const handleSend = () => {
    if (!input.trim() && currentQuestion.type !== 'choice') return;
    
    const userMessage = input.trim();
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    }]);
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: userMessage,
    }));
    
    setInput('');
    
    // Move to next question or complete
    if (currentQuestionIndex < briefingQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // AI acknowledgment + next question
      const acknowledgments = [
        'Perfeito! Entendi.',
        'Ótimo! Isso me ajuda muito.',
        'Interessante! Vamos continuar.',
        'Excelente! Próxima pergunta.',
        'Show! Tô captando tudo.',
      ];
      const ack = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
      
      addAIMessage(ack, undefined, 300);
      
      setTimeout(() => {
        const nextQ = briefingQuestions[nextIndex];
        addAIMessage(
          nextQ.subtext ? `${nextQ.question}\n\n${nextQ.subtext}` : nextQ.question,
          nextQ.id,
          800
        );
      }, 1500);
    } else {
      // Complete!
      setIsComplete(true);
      addAIMessage(
        `🎉 Perfeito! Tenho todas as informações que preciso.\n\nAgora vou ativar o Assembly Line com 16 agentes de IA para criar:\n\n• DNA Psicológico\n• Pesquisa de Mercado\n• Avatar Detalhado\n• Oferta Irresistível\n• Funil Completo\n• Conteúdos e Emails\n\nIsso levaria semanas pra fazer manualmente. Vou fazer em minutos. 🚀`,
        undefined,
        500
      );
    }
  };

  // Handle choice selection
  const handleChoiceSelect = (choice: string) => {
    setInput(choice);
    setTimeout(() => handleSend(), 100);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(prev => prev ? `${prev}, ${suggestion}` : suggestion);
    inputRef.current?.focus();
  };

  // Start generation
  const handleStartGeneration = () => {
    // Add new project
    addProject({
      id: Date.now().toString(),
      name: answers.product?.slice(0, 30) || 'Novo Projeto',
      status: 'generating',
      progress: 0,
      lastUpdate: 'agora',
      roi: 'Calculando...',
      createdAt: new Date().toISOString(),
    });
    
    // Go to generation page
    setActiveTab('generation');
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      {/* Progress Header */}
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Briefing Inteligente</h3>
              <p className="text-sm text-white/40">
                {isComplete 
                  ? 'Briefing completo!' 
                  : `Pergunta ${currentQuestionIndex + 1} de ${briefingQuestions.length}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveTab('dashboard')}>
              <ArrowLeft className="w-4 h-4" />
              Cancelar
            </Button>
          </div>
        </div>
        
        <Progress value={isComplete ? 100 : progress} showLabel size="md" />
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden mb-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <MessageBubble 
              key={message.id} 
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name="AI" size="sm" />
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Choices (for choice questions) */}
          {!isTyping && currentQuestion?.type === 'choice' && currentQuestion.choices && !isComplete && (
            <div className="flex flex-wrap gap-2 animate-slide-up">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleChoiceSelect(choice)}
                  className="px-4 py-2 rounded-xl glass glass-hover text-sm font-medium transition-all hover:border-brand-500/50"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}
          
          {/* Complete - Start Generation Button */}
          {isComplete && (
            <div className="flex justify-center pt-4 animate-slide-up">
              <Button size="lg" onClick={handleStartGeneration} className="shadow-glow">
                <Play className="w-5 h-5" />
                Iniciar Assembly Line
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* AI Suggestions */}
        {!isComplete && currentQuestion?.aiSuggestions && (
          <div className="px-6 pb-3 animate-fade-in">
            <p className="text-xs text-white/30 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Sugestões:
            </p>
            <div className="flex flex-wrap gap-2">
              {currentQuestion.aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        {!isComplete && currentQuestion?.type !== 'choice' && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              {/* Voice Button */}
              <IconButton className="text-white/40 hover:text-brand-400">
                <Mic className="w-5 h-5" />
              </IconButton>
              
              {/* Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={currentQuestion?.placeholder || 'Digite sua resposta...'}
                  className="w-full bg-white/5 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/30 outline-none border border-white/10 focus:border-brand-500/50 transition-all"
                  disabled={isTyping}
                />
              </div>
              
              {/* Attachment */}
              <IconButton className="text-white/40 hover:text-white">
                <Paperclip className="w-5 h-5" />
              </IconButton>
              
              {/* Send */}
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Quick Tips */}
      {!isComplete && (
        <div className="text-center text-xs text-white/30 animate-fade-in">
          💡 Dica: Seja específico nas respostas para uma estratégia mais precisa
        </div>
      )}
    </div>
  );
};

// ============================================
// MESSAGE BUBBLE
// ============================================

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const isAI = message.role === 'ai';
  
  return (
    <div 
      className={cn(
        'flex gap-3 animate-slide-up',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      {isAI && (
        <Avatar name="AI" size="sm" className="flex-shrink-0 mt-1" />
      )}
      
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isAI 
            ? 'glass rounded-bl-md' 
            : 'bg-gradient-to-r from-brand-500 to-blue-500 rounded-br-md'
        )}
      >
        {isAI && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/40">Assembly Line</span>
            {message.questionId && (
              <Badge variant="brand" className="text-2xs">
                {briefingQuestions.findIndex(q => q.id === message.questionId) + 1}/{briefingQuestions.length}
              </Badge>
            )}
          </div>
        )}
        
        <p className={cn(
          'text-sm whitespace-pre-wrap',
          isAI ? 'text-white/90' : 'text-white'
        )}>
          {message.content}
        </p>
        
        <p className={cn(
          'text-2xs mt-1',
          isAI ? 'text-white/30' : 'text-white/60'
        )}>
          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {!isAI && (
        <Avatar name="M" size="sm" className="flex-shrink-0 mt-1" />
      )}
    </div>
  );
};

// ============================================
// BRIEFING SUMMARY (for review before generation)
// ============================================

interface BriefingSummaryProps {
  answers: Record<string, string>;
  onEdit: (questionId: string) => void;
  onConfirm: () => void;
}

const BriefingSummary: React.FC<BriefingSummaryProps> = ({ answers, onEdit, onConfirm }) => {
  return (
    <Card className="animate-slide-up">
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <Check className="w-5 h-5 text-success" />
        Resumo do Briefing
      </h4>
      
      <div className="space-y-4">
        {briefingQuestions.map((question) => (
          <div key={question.id} className="flex items-start justify-between gap-4 pb-4 border-b border-white/5 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-white/40 mb-1">{question.question}</p>
              <p className="text-sm">{answers[question.id] || '-'}</p>
            </div>
            <IconButton size="sm" onClick={() => onEdit(question.id)}>
              <RotateCcw className="w-4 h-4" />
            </IconButton>
          </div>
        ))}
      </div>
      
      <Button className="w-full mt-6" onClick={onConfirm}>
        <Sparkles className="w-4 h-4" />
        Confirmar e Gerar Estratégia
      </Button>
    </Card>
  );
};

export default BriefingContent;
