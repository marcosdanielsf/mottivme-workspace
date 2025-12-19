import { google } from '@ai-sdk/google';
import { Agent, VoltAgent } from '@voltagent/core';
import { honoServer } from '@voltagent/server-hono';
import { createPinoLogger } from '@voltagent/logger';

// Logger
const logger = createPinoLogger({
  name: 'my-agent-app',
  level: 'info',
});

// Agente com Google Gemini 2.0 Flash (modelo mais barato!)
const agent = new Agent({
  name: 'Assistente Econômico',
  instructions: `Você é um assistente prestativo em português.
Responda de forma clara, amigável e concisa.
Sempre cumprimente o usuário de forma educada.`,
  model: google('gemini-2.0-flash-exp'),
});

// Inicia o servidor
new VoltAgent({
  agents: { agent },
  logger,
  server: honoServer({ port: 3000 }),
});

console.log('🤖 Servidor iniciado em http://localhost:3000');
console.log('💰 Usando Google Gemini 2.0 Flash ($0.075 input / $0.30 output por 1M tokens)');
console.log('\n📝 Teste o agente:');
console.log('   curl http://localhost:3000/v1/chat/completions \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"messages": [{"role": "user", "content": "Olá! Como você está?"}]}\'');
console.log('\nOu acesse http://localhost:3000 no navegador!\n');
