# n8n-mcp Codebase Inventory

> **Purpose**: This file maps the n8n-mcp codebase structure to help Claude navigate and understand what each component does. Use this for quick reference instead of running `/init` on large codebases.

## 📁 Project Structure Overview

### `/src` - Core Source Code

#### **Data Loading & Processing**
- `loaders/node-loader.ts` - Loads n8n nodes from NPM packages (n8n and @n8n/n8n-nodes-langchain)
- `parsers/node-parser.ts` - Parses node files and extracts metadata, properties, operations
- `parsers/property-extractor.ts` - Deep extraction of node properties and their configurations
- `mappers/docs-mapper.ts` - Maps external n8n documentation to node entries

#### **Database Layer**
- `database/schema.sql` - SQLite schema definition for nodes, properties, operations, templates
- `database/node-repository.ts` - Data access layer for node CRUD operations
- `database/database-adapter.ts` - Universal adapter supporting better-sqlite3 and sql.js
- **Dependencies**: Uses Repository pattern for all database operations

#### **Service Layer** (Business Logic)
- `services/property-filter.ts` - Filters node properties to AI-friendly essentials only
- `services/example-generator.ts` - Generates working configuration examples for nodes
- `services/task-templates.ts` - Pre-configured node settings for common tasks
- `services/config-validator.ts` - Multi-profile validation (minimal/runtime/ai-friendly/strict)
- `services/enhanced-config-validator.ts` - Operation-aware validation with context
- `services/node-specific-validators.ts` - Custom validation logic per node type
- `services/property-dependencies.ts` - Analyzes property dependencies and requirements
- `services/expression-validator.ts` - Validates n8n expression syntax (e.g., `{{ $json.field }}`)
- `services/workflow-validator.ts` - Complete workflow structure and connection validation

#### **Template System**
- `templates/template-fetcher.ts` - Fetches workflow templates from n8n.io API
- `templates/template-repository.ts` - Database operations for templates
- `templates/template-service.ts` - Business logic for template management
- **Use Case**: Provides pre-built workflow examples to AI assistants

#### **MCP Server** (Model Context Protocol)
- `mcp/server.ts` - Main MCP server implementation with tool handlers
- `mcp/tools.ts` - Tool definitions exposed to AI assistants
- `mcp/tools-documentation.ts` - Dynamic documentation system for MCP tools
- `mcp/index.ts` - Entry point with mode selection (stdio/HTTP)
- **Modes**: Supports both stdio (Claude Desktop) and HTTP server modes

#### **Utilities**
- `utils/console-manager.ts` - Isolates console output to prevent MCP protocol contamination
- `utils/logger.ts` - Logging with HTTP awareness (silent in stdio mode)

#### **Library Exports & Engines**
- `index.ts` - Main library exports for programmatic usage
- `mcp-engine.ts` - Clean API for integrating MCP functionality into other services
- `http-server-single-session.ts` - Single-session HTTP server implementation

### `/scripts` - Development & Testing Scripts

#### **Database Management**
- `rebuild.ts` - Rebuilds entire database from n8n packages (takes 2-3 min)
- `validate.ts` - Validates all node data integrity in database

#### **Testing Scripts**
- `test-nodes.ts` - Tests critical node functionality
- `test-essentials.ts` - Tests essential node info tools
- `test-enhanced-validation.ts` - Tests operation-aware validation
- `test-workflow-validation.ts` - Tests complete workflow validation
- `test-ai-workflow-validation.ts` - Tests AI-specific workflow scenarios
- `test-mcp-tools.ts` - Tests MCP tool enhancements
- `test-n8n-validate-workflow.ts` - Tests n8n_validate_workflow tool
- `test-typeversion-validation.ts` - Tests typeVersion compatibility
- `test-workflow-diff.ts` - Tests workflow diff engine
- `test-tools-documentation.ts` - Tests tools documentation system
- `test-templates.ts` - Tests template functionality

#### **Template Management**
- `fetch-templates.ts` - Fetches latest workflow templates from n8n.io

### `/tests` - Test Suites
- `unit/` - Unit tests for individual components
- `integration/` - Integration tests requiring full database
- **Run With**: `npm test`, `npm run test:unit`, `npm run test:integration`

### `/data` - Runtime Data
- `nodes.db` - SQLite database containing all n8n node information
- **Rebuild**: Run `npm run rebuild` to regenerate from n8n packages

### Configuration Files (Root)
- `package.json` - Dependencies, scripts, project metadata
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Test runner configuration
- `.env.example` - Example environment variables
- `CLAUDE.md` - Claude Code instructions and workflows

## 🎯 Common Development Scenarios

### Scenario: Modify Node Parsing Logic
**Files to Change**: `parsers/node-parser.ts`, `parsers/property-extractor.ts`
**Test With**: `npm run rebuild && npm run validate`
**Impact**: Affects how node metadata is extracted from source files

### Scenario: Add New MCP Tool
**Files to Change**: `mcp/tools.ts`, `mcp/server.ts`
**Test With**: `npm run build` then reload MCP server
**Impact**: Adds new capabilities for AI assistants

### Scenario: Improve Validation Logic
**Files to Change**: `services/*-validator.ts`, `services/node-specific-validators.ts`
**Test With**: `npm run test:unit -- tests/unit/services/`
**Impact**: Changes how node configurations are validated

### Scenario: Update Database Schema
**Files to Change**: `database/schema.sql`, `database/node-repository.ts`
**Test With**: Delete `data/nodes.db`, run `npm run rebuild`
**Impact**: Requires database rebuild, affects all queries

### Scenario: Add Workflow Template Support
**Files to Change**: `templates/*.ts`, `mcp/tools.ts` (add template tools)
**Test With**: `npm run fetch:templates && npm run test:templates`
**Impact**: Adds pre-built workflow examples

## 🔍 Quick Navigation Tips

### To Find Code Related To:
- **Node search/discovery**: `database/node-repository.ts`, `mcp/tools.ts` (search_nodes tool)
- **Validation**: `services/*-validator.ts`
- **n8n expressions**: `services/expression-validator.ts`
- **Workflow management**: `services/workflow-validator.ts`, `mcp/tools.ts` (workflow tools)
- **Database operations**: `database/node-repository.ts` (single source of truth)
- **API integration**: `mcp-engine.ts`, `http-server-single-session.ts`

### To Test Components:
- **Services**: `tests/unit/services/`
- **MCP Tools**: `scripts/test-mcp-tools.ts`
- **Workflows**: `scripts/test-workflow-validation.ts`
- **Database**: `scripts/validate.ts`

## 📦 External Dependencies

### Critical npm Packages
- `n8n` - Core n8n package containing most nodes
- `@n8n/n8n-nodes-langchain` - LangChain integration nodes
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `better-sqlite3` - Fast SQLite driver (Node.js)
- `sql.js` - WASM SQLite (browser/universal)

### Development Tools
- `typescript` - Type system and compiler
- `jest` - Test framework
- `tsx` - TypeScript execution

## 🚀 Performance Notes

- Use `get_node_essentials()` instead of `get_node_info()` for 60% faster responses
- Diff-based workflow updates save 80-90% tokens
- Database rebuilds are expensive (2-3 min) - cache when possible
- FTS5 full-text search is optimized for large queries

## 🔗 Cross-Component References

### Property Filtering Pipeline
`node-loader.ts` → `node-parser.ts` → `property-extractor.ts` → `property-filter.ts` → `node-repository.ts`

### Validation Pipeline
`config-validator.ts` → `enhanced-config-validator.ts` → `node-specific-validators.ts` + `expression-validator.ts`

### MCP Tool Execution
`mcp/server.ts` receives request → calls `mcp/tools.ts` handler → uses `services/*` + `database/node-repository.ts` → returns result

### Template Flow
`template-fetcher.ts` (API) → `template-service.ts` (business logic) → `template-repository.ts` (DB) → `mcp/tools.ts` (expose to AI)
