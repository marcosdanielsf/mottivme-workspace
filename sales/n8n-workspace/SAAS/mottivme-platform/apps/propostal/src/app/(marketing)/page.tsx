"use client";

import { Button } from "@/components/ui/button";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  Eye,
  MessageCircle,
  Rocket,
  Target,
  Zap,
  ArrowRight,
  Check,
  Play
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-6 md:px-16 py-5 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <Link href="/" className="text-2xl font-bold gradient-text tracking-wider">
          PROPOSTAL
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-400 hover:text-gold transition-colors">
            Recursos
          </Link>
          <Link href="#pricing" className="text-gray-400 hover:text-gold transition-colors">
            Preços
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          <span className="inline-block px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm mb-6">
            A proposta que fecha sozinha
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Propostas que{" "}
            <span className="gradient-text">Rastreiam</span>,{" "}
            <span className="gradient-text">Engajam</span> e{" "}
            <span className="gradient-text">Convertem</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Transforme PDFs chatos em portais interativos. Saiba exatamente quando seu
            lead está quente e feche mais negócios com inteligência.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="group">
                Começar Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Play className="w-5 h-5" />
              Ver Demo
            </Button>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Sem cartão de crédito • 14 dias grátis • Cancele quando quiser
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-8 md:gap-16 mt-20 text-center"
        >
          {[
            { value: "85%", label: "Taxa de Abertura" },
            { value: "3.2x", label: "Mais Conversões" },
            { value: "12min", label: "Tempo Médio" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Tudo que você precisa para{" "}
              <span className="gradient-text">fechar mais</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Propostas interativas com rastreamento em tempo real, chat inteligente e
              alertas automáticos quando seu lead está pronto para fechar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "Rastreamento em Tempo Real",
                description: "Saiba exatamente quando seu lead abre, quanto tempo fica em cada seção e quais partes mais interessam.",
              },
              {
                icon: Target,
                title: "Score de Interesse",
                description: "Algoritmo inteligente que calcula de 0-100 o quão quente está seu lead baseado no comportamento.",
              },
              {
                icon: Bot,
                title: "Avatar AI Luna",
                description: "Assistente virtual que cumprimenta seu cliente pelo nome com vídeo personalizado.",
              },
              {
                icon: MessageCircle,
                title: "Chat Híbrido",
                description: "Luna responde dúvidas automaticamente e escala para você quando detecta intenção de compra.",
              },
              {
                icon: Zap,
                title: "Alertas Inteligentes",
                description: "Receba notificação no WhatsApp quando um lead atinge score alto ou clica no CTA.",
              },
              {
                icon: BarChart3,
                title: "Dashboard Completo",
                description: "Visualize todas as propostas, leads e métricas em um painel centralizado.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group hover:border-gold/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6 md:px-16 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Como funciona
            </h2>
            <p className="text-gray-400">Em 3 passos simples</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crie sua proposta",
                description: "Use nosso editor visual ou importe seu conteúdo. Personalize cores, logo e adicione seu vídeo.",
              },
              {
                step: "02",
                title: "Envie o link",
                description: "Cada proposta tem uma URL única. Envie por email, WhatsApp ou qualquer canal.",
              },
              {
                step: "03",
                title: "Acompanhe e feche",
                description: "Veja em tempo real o comportamento do lead. Receba alertas e feche no momento certo.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-gold/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Planos que <span className="gradient-text">cabem no seu bolso</span>
            </h2>
            <p className="text-gray-400">Comece grátis e escale conforme cresce</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "R$ 197",
                description: "Perfeito para começar",
                features: [
                  "10 propostas/mês",
                  "Rastreamento básico",
                  "Chat Luna (100 msgs)",
                  "1 usuário",
                  "Suporte por email",
                ],
                highlighted: false,
              },
              {
                name: "Pro",
                price: "R$ 497",
                description: "Para quem quer escalar",
                features: [
                  "Propostas ilimitadas",
                  "Rastreamento completo",
                  "Chat Luna ilimitado",
                  "5 usuários",
                  "Alertas WhatsApp",
                  "Vídeo personalizado",
                  "Suporte prioritário",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "R$ 1.497",
                description: "Para grandes equipes",
                features: [
                  "Tudo do Pro",
                  "Usuários ilimitados",
                  "API access",
                  "White-label",
                  "Onboarding dedicado",
                  "SLA garantido",
                ],
                highlighted: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card ${plan.highlighted ? "border-2 border-gold glow-gold relative" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black text-sm font-semibold rounded-full">
                    Mais Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
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
                >
                  Começar Agora
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-surface rounded-3xl p-12 border border-gold/20 glow-gold"
        >
          <Rocket className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para fechar mais negócios?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Junte-se a centenas de empresas que já transformaram suas propostas em
            máquinas de conversão.
          </p>
          <Link href="/register">
            <Button size="lg">
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 border-t border-gold/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold gradient-text">PROPOSTAL</div>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              Termos
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors">
              Contato
            </Link>
          </div>
          <div className="text-gray-500 text-sm">
            © 2025 Mottivme Sales. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
