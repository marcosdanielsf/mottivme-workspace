import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

// Servidor MCP para acionar webhooks do n8n via HTTP
const server = new McpServer({ name: 'n8n-mcp', version: '0.1.0' });

server.registerTool(
  'trigger_webhook',
  {
    title: 'Dispara webhook do n8n',
    description: 'Chama um webhook do n8n com método, payload e cabeçalhos opcionais',
    inputSchema: {
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH']).default('POST'),
      path: z.string().describe('Caminho do webhook, ex: /webhook/<id>'),
      payload: z.record(z.any()).optional(),
      headers: z.record(z.string()).optional(),
    },
  },
  async ({ method, path, payload, headers }) => {
    const base = process.env.N8N_BASE_URL;
    if (!base) throw new Error('Defina N8N_BASE_URL no ambiente');

    const url = new URL(path, base).href;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const apiKey = process.env.N8N_API_KEY;
    // Injeta automaticamente X-N8N-API-KEY se estiver definido e não houver Authorization / X-N8N-API-KEY explícito
    if (apiKey && !(headers && (headers['Authorization'] || headers['X-N8N-API-KEY']))) {
      defaultHeaders['X-N8N-API-KEY'] = apiKey;
    }

    const opts = {
      method,
      headers: { ...defaultHeaders, ...(headers || {}) },
      body: ['POST', 'PUT', 'PATCH'].includes(method)
        ? JSON.stringify(payload || {})
        : undefined,
    };

    const res = await fetch(url, opts);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      content: [
        { type: 'text', text: JSON.stringify({ status: res.status, data }) },
      ],
      structuredContent: { status: res.status, data },
    };
  }
);

const app = express();
app.use(express.json());

// Endpoint MCP HTTP streamable
app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
  res.on('close', () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`MCP HTTP do n8n escutando em http://localhost:${port}/mcp`);
});