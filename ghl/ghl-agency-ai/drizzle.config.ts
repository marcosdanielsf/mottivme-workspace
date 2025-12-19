import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: [
    "./drizzle/ghl-schema.ts",
    "./drizzle/schema.ts",
    "./drizzle/schema-scheduled-tasks.ts",
    "./drizzle/schema-rag.ts",
    "./drizzle/schema-webhooks.ts",
    "./drizzle/schema-agent.ts",
    "./drizzle/schema-knowledge.ts",
    "./drizzle/schema-admin.ts",
    "./drizzle/schema-alerts.ts",
    "./drizzle/schema-email.ts",
    "./drizzle/schema-lead-enrichment.ts",
    "./drizzle/schema-meta-ads.ts",
    "./drizzle/schema-seo.ts",
    "./drizzle/schema-subscriptions.ts",
    "./drizzle/relations.ts",
    "./server/rag/schema.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  schemaFilter: ["ghl_agency"],
  tablesFilter: ["ghl_agency.*"],
});
