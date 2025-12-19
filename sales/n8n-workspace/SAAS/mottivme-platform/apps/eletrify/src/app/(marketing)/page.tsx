"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  FileText,
  Mail,
  Video,
  Search,
  ArrowRight,
  Check,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full px-6 md:px-16 py-5 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <Link href="/" className="text-2xl font-bold gradient-text tracking-wider flex items-center gap-2">
          <Zap className="w-6 h-6" />
          ELETRIFY
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-400 hover:text-gold transition-colors">
            Recursos
          </Link>
          <Link href="#pricing" className="text-gray-400 hover:text-gold transition-colors">
            Preços
          </Link>
          <Link href="/login" className="btn-outline text-sm py-2 px-4">
            Entrar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

        {/* Floating triggers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {["👑", "💰", "🔥", "😈", "🍕", "😴", "😤", "❤️", "🔍", "🎉", "🦅", "👥", "🎁", "🛡️"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Sexy Canvas + IA
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            Copies que{" "}
            <span className="gradient-text">ELETRIFICAM</span>{" "}
            <br className="hidden md:block" />
            a mente do cliente
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Gere copies, emails, VSLs e propostas usando os <strong className="text-gold">14 gatilhos emocionais</strong>{" "}
            da metodologia Sexy Canvas de André Diamand.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-gold flex items-center justify-center gap-2">
              Começar a Eletrificar
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="btn-outline flex items-center justify-center gap-2">
              Ver Demo
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Sem cartão de crédito • 5 gerações grátis • Metodologia comprovada
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center"
        >
          {[
            { value: "14", label: "Gatilhos Emocionais" },
            { value: "3.2x", label: "Mais Conversões" },
            { value: "+500", label: "Copies Geradas" },
            { value: "94%", label: "Satisfação" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Triggers Section */}
      <section className="py-20 px-6 md:px-16 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Os <span className="gradient-text">14 Gatilhos</span> do Sexy Canvas
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cada gatilho ativa uma emoção específica no cérebro do seu cliente.
              A IA combina os gatilhos certos para cada tipo de material.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {/* 7 Pecados */}
            {[
              { emoji: "👑", name: "Vaidade" },
              { emoji: "💰", name: "Avareza" },
              { emoji: "🔥", name: "Luxúria" },
              { emoji: "😈", name: "Inveja" },
              { emoji: "🍕", name: "Gula" },
              { emoji: "😴", name: "Preguiça" },
              { emoji: "😤", name: "Ira" },
            ].map((trigger, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card text-center py-6 group hover:border-red-500/50"
              >
                <div className="text-4xl mb-2">{trigger.emoji}</div>
                <div className="text-sm font-medium">{trigger.name}</div>
                <div className="text-xs text-red-500 mt-1">Pecado Capital</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {/* 7 Criança Interior */}
            {[
              { emoji: "❤️", name: "Amor" },
              { emoji: "🔍", name: "Curiosidade" },
              { emoji: "🎉", name: "Diversão" },
              { emoji: "🦅", name: "Liberdade" },
              { emoji: "👥", name: "Pertencimento" },
              { emoji: "🎁", name: "Recompensa" },
              { emoji: "🛡️", name: "Segurança" },
            ].map((trigger, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card text-center py-6 group hover:border-blue-500/50"
              >
                <div className="text-4xl mb-2">{trigger.emoji}</div>
                <div className="text-sm font-medium">{trigger.name}</div>
                <div className="text-xs text-blue-500 mt-1">Criança Interior</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
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
              <span className="gradient-text">eletrificar</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Gerador de Copy",
                description: "Posts, headlines, hooks e CTAs eletrificados com os gatilhos certos para cada objetivo.",
                color: "text-gold",
              },
              {
                icon: Mail,
                title: "Gerador de Emails",
                description: "Sequências de vendas, cold emails e nurturing com alta taxa de abertura e conversão.",
                color: "text-electric-blue",
              },
              {
                icon: Video,
                title: "Gerador de VSL",
                description: "Scripts de vídeo de vendas completos com estrutura de 10-15 minutos que convertem.",
                color: "text-purple-mystic",
              },
              {
                icon: Search,
                title: "Analisador de Copy",
                description: "Analise qualquer texto e descubra quais gatilhos estão sendo usados e quais faltam.",
                color: "text-green-500",
              },
              {
                icon: Brain,
                title: "IA Treinada",
                description: "Modelo de IA treinado especificamente na metodologia Sexy Canvas de André Diamand.",
                color: "text-pink-500",
              },
              {
                icon: Target,
                title: "Score de Eletrificação",
                description: "Receba uma pontuação de 0-100 e sugestões de como melhorar seus materiais.",
                color: "text-orange-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <div className={`w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4 border border-gold/10 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 md:px-16 bg-surface/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Planos que <span className="gradient-text">cabem no seu bolso</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "R$ 0",
                description: "Para experimentar",
                features: [
                  "5 gerações/mês",
                  "Gerador de Copy",
                  "Analisador básico",
                ],
                highlighted: false,
              },
              {
                name: "Pro",
                price: "R$ 97",
                description: "Para profissionais",
                features: [
                  "100 gerações/mês",
                  "Todos os geradores",
                  "Analisador completo",
                  "Templates premium",
                  "Suporte prioritário",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "R$ 297",
                description: "Para equipes",
                features: [
                  "Gerações ilimitadas",
                  "5 usuários",
                  "API access",
                  "Treinamento",
                  "Suporte dedicado",
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
                className={`card relative ${plan.highlighted ? "border-2 border-gold glow-gold" : ""}`}
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
                <button className={plan.highlighted ? "btn-gold w-full" : "btn-outline w-full"}>
                  Começar Agora
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center card border-2 border-gold glow-gold py-12"
        >
          <Zap className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para ELETRIFICAR suas copies?
          </h2>
          <p className="text-gray-400 mb-8">
            Junte-se a centenas de profissionais que já usam o poder dos 14 gatilhos.
          </p>
          <Link href="/register" className="btn-gold inline-flex items-center gap-2">
            Começar Grátis Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-16 border-t border-gold/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold" />
            <span className="text-xl font-bold gradient-text">ELETRIFY</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2025 Mottivme Sales. Baseado na metodologia Sexy Canvas de André Diamand.
          </div>
        </div>
      </footer>
    </>
  );
}
