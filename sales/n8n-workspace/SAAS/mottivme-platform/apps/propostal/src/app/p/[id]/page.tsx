"use client";

import { CustomCursor } from "@/components/ui/custom-cursor";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef, use } from "react";
import {
  Check,
  ChevronDown,
  MessageCircle,
  Play,
  X,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Target,
  Users,
  TrendingUp
} from "lucide-react";

// Demo data - em produção virá do banco
const proposalData = {
  company: {
    name: "Mottivme Sales",
    logo: null,
    brandColor: "#d4af37",
  },
  client: {
    name: "João",
    company: "Empresa ABC",
  },
  hero: {
    headline: "Transforme seu Negócio em uma Máquina Comercial",
    subheadline: "Estruturação completa em 30 dias com metodologia comprovada",
  },
  problems: [
    "Oferta que não converte como deveria",
    "Funil quebrado ou inexistente",
    "Sem scripts de vendas prontos",
    "CRM desorganizado",
    "Vendas imprevisíveis mês a mês",
  ],
  solutions: [
    {
      icon: Target,
      title: "Brand Book Completo",
      description: "40 páginas de posicionamento estratégico, ICP e avatar detalhado.",
    },
    {
      icon: Zap,
      title: "Offer Stack Irresistível",
      description: "Estruturação de oferta usando metodologia Hormozi.",
    },
    {
      icon: TrendingUp,
      title: "3 Funis Completos",
      description: "Orgânico, tráfego pago e outbound prontos para rodar.",
    },
    {
      icon: Users,
      title: "20 Scripts Prontos",
      description: "Scripts de vendas, SDR, anúncios e conteúdo validados.",
    },
  ],
  pricing: [
    {
      title: "À Vista",
      value: 53982,
      originalValue: 63000,
      features: [
        "8 entregáveis completos",
        "30 dias de estruturação",
        "Garantia 100%",
        "Bônus de R$ 12.700",
      ],
      highlighted: true,
      discount: "14% OFF",
    },
    {
      title: "Parcelado",
      value: 61980,
      installments: 4,
      installmentValue: 15495,
      features: [
        "8 entregáveis completos",
        "30 dias de estruturação",
        "Garantia 100%",
      ],
      highlighted: false,
    },
  ],
  testimonials: [
    {
      name: "Dr. Carlos",
      role: "Médico Cardiologista",
      text: "Em 3 meses, fechei 12 mentorias de R$ 15k cada. ROI absurdo.",
      result: "+180k faturados",
    },
    {
      name: "Ana Paula",
      role: "Consultora de RH",
      text: "Meu show-rate foi de 35% para 72%. Mudou completamente meu negócio.",
      result: "+106% conversão",
    },
  ],
  cta: {
    text: "Agendar Conversa",
    url: "https://calendly.com/mottivme/30min",
  },
  expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function ProposalPortal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: `Olá ${proposalData.client.name}! Sou a Luna, assistente da ${proposalData.company.name}. Posso ajudar com alguma dúvida sobre a proposta?` }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // In production: send tracking event
            console.log(`Section entered: ${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setChatMessages([...chatMessages, { sender: "user", text: inputMessage }]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Entendi! Vou verificar isso para você. Quer que eu agende uma call para tirarmos todas as dúvidas?" }
      ]);
    }, 1000);
  };

  return (
    <div ref={containerRef} className="relative">
      <CustomCursor />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface z-50">
        <motion.div
          className="h-full bg-gold"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating header */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 w-full px-6 py-4 bg-black/90 backdrop-blur-xl border-b border-gold/10 z-40"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="gradient-text font-bold">{proposalData.company.name}</span>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              <Clock className="w-4 h-4 inline mr-1" />
              {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, "0")}
            </span>
            <Button size="sm" onClick={() => window.open(proposalData.cta.url, "_blank")}>
              {proposalData.cta.text}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative z-10"
        >
          <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm mb-6">
            Proposta Exclusiva para {proposalData.client.name}
          </span>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            {proposalData.hero.headline}
          </h1>

          <p className="text-xl text-gray-400 mb-10">
            {proposalData.hero.subheadline}
          </p>

          <Button size="lg" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            Ver Proposta Completa
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10"
        >
          <ChevronDown className="w-8 h-8 text-gold" />
        </motion.div>
      </section>

      {/* Problems Section */}
      <section id="problems" className="py-20 px-6 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Você está enfrentando esses <span className="gradient-text">desafios</span>?
            </h2>
          </motion.div>

          <div className="space-y-4">
            {proposalData.problems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-black rounded-xl border border-red-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-gray-300">{problem}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              O que você vai <span className="gradient-text">receber</span>
            </h2>
            <p className="text-gray-400">8 entregáveis completos em 30 dias</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {proposalData.solutions.map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <solution.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-gray-400">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Quem já <span className="gradient-text">transformou</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {proposalData.testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="inline-block px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold">
                  {testimonial.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Investimento
            </h2>
            <p className="text-gray-400">Escolha a melhor opção para você</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {proposalData.pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card relative ${plan.highlighted ? "border-2 border-gold glow-gold" : ""}`}
              >
                {plan.discount && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-gold text-black text-sm font-bold rounded-full">
                    {plan.discount}
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>

                {plan.originalValue && (
                  <p className="text-gray-500 line-through text-lg">
                    {formatCurrency(plan.originalValue)}
                  </p>
                )}

                <div className="mb-4">
                  {plan.installments ? (
                    <>
                      <span className="text-2xl text-gray-400">{plan.installments}x de </span>
                      <span className="text-4xl font-bold gradient-text">
                        {formatCurrency(plan.installmentValue!)}
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold gradient-text">
                      {formatCurrency(plan.value)}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "gold" : "outline"}
                  className="w-full"
                  onClick={() => window.open(proposalData.cta.url, "_blank")}
                >
                  {proposalData.cta.text}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-center"
          >
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Garantia 100%</h3>
            <p className="text-gray-400 max-w-xl mx-auto">
              Se ao final de 30 dias você não receber todos os 8 entregáveis prometidos,
              devolvemos 100% do seu investimento. Zero risco.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-20 px-6 bg-surface/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-gray-400 mb-8">
            Agende uma conversa de 30 minutos para tirar todas as suas dúvidas.
          </p>
          <Button
            size="lg"
            onClick={() => window.open(proposalData.cta.url, "_blank")}
          >
            {proposalData.cta.text}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-80 h-96 bg-surface border border-gold/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat header */}
            <div className="p-4 border-b border-gold/10 flex justify-between items-center bg-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Luna</p>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-gold text-black rounded-br-sm"
                        : "bg-black text-white rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-gold/10 bg-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 bg-surface border border-gold/20 rounded-full text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-10 h-10 bg-gold text-black rounded-full flex items-center justify-center hover:bg-gold-light transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowChat(true)}
            className="w-14 h-14 bg-gold text-black rounded-full flex items-center justify-center shadow-lg glow-gold"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gold/10 text-center">
        <p className="text-gray-500 text-sm">
          Proposta criada por {proposalData.company.name} • Powered by Propostal
        </p>
      </footer>
    </div>
  );
}
