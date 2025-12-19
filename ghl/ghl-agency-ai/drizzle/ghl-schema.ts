import { pgSchema } from "drizzle-orm/pg-core";

// Define the custom schema to avoid conflicts with existing Mottivme tables
export const ghlAgencySchema = pgSchema("ghl_agency");

// Helper to create tables in the ghl_agency schema
export const ghlTable = ghlAgencySchema.table.bind(ghlAgencySchema);
