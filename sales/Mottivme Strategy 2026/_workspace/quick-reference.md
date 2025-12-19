# n8n-mcp Quick Reference Guide

> **Quick access to essential commands, workflows, and Claude Code tips for maximum productivity**

## 🚀 Essential Claude Code Commands

### Navigation & Planning
- `/init` - Initialize and analyze repository structure
- `/plan` - Enter plan mode for complex tasks (ALWAYS use for non-trivial changes)
- `/context` - Check remaining context window capacity (aim for 80%+ free)
- `/clear` - Clear context and start fresh session
- `/compact` - Create TLDR summary and clear history (preserves tracker files)
- `/re` - Rewind to previous checkpoint (undo feature)

### Project Management
- `#instruction` - Add persistent instruction to CLAUDE.md (Global Brain)
- `/plugins` - Browse and install plugin marketplace packages

### Files & Configuration
- `CLAUDE.md` - Project command center, rules, and memory
- `codebase-inventory.md` - Map of files to functionalities (use instead of /init)
- `settings.local.json` - True source for settings, plugins, permissions
- `MCP.json` - Direct MCP server configuration (if needed)

## 📋 Common Development Workflows

### Workflow 1: Making Changes to MCP Server
```bash
1. Make code changes in src/mcp/
2. npm run build
3. Ask user to reload MCP server in Claude Desktop
4. Test changes with npm run test:mcp-tools
```

### Workflow 2: Database Schema Changes
```bash
1. Update database/schema.sql
2. Update database/node-repository.ts (queries)
3. Delete data/nodes.db
4. npm run rebuild
5. npm run validate
```

### Workflow 3: Adding New Validation Logic
```bash
1. Create/modify files in services/*-validator.ts
2. Add tests in tests/unit/services/
3. npm run build
4. npm test -- tests/unit/services/your-test.test.ts
5. npm run rebuild (if affects database)
```

### Workflow 4: Adding New MCP Tool
```bash
1. Define tool in mcp/tools.ts
2. Add handler in mcp/server.ts
3. Update mcp/tools-documentation.ts (optional)
4. npm run build
5. Reload MCP server
6. Test with scripts/test-mcp-tools.ts
```

### Workflow 5: Phased Development (Complex Features)
```bash
1. Use /plan to create phases with milestones
2. Create tracker.md with checkboxes for each phase
3. Complete Phase 1
4. Check /context (aim for 80%+ free)
5. Use /clear to reset context
6. Move to Phase 2 (referring to tracker.md)
7. Repeat until all phases complete
```

## 🎯 n8n-mcp Specific Commands

### Build & Setup
```bash
npm run build          # Build TypeScript (ALWAYS run after code changes)
npm run rebuild        # Rebuild node database (2-3 min, use sparingly)
npm run validate       # Validate all node data integrity
npm run dev            # Build + rebuild + validate (full refresh)
```

### Testing
```bash
npm test                           # Run all tests
npm run test:unit                  # Unit tests only
npm run test:integration           # Integration tests only
npm run test:coverage              # Coverage report
npm test -- path/to/test.test.ts   # Single test file
```

### Database Management
```bash
npm run db:rebuild      # Rebuild database from scratch
npm run migrate:fts5    # Migrate to FTS5 search
```

### Template Management
```bash
npm run fetch:templates  # Fetch latest workflow templates from n8n.io
npm run test:templates   # Test template functionality
```

### n8n Updates
```bash
npm run update:n8n:check  # Check for n8n package updates (dry run)
npm run update:n8n        # Update n8n packages to latest
```

### Running MCP Server
```bash
npm start           # Start MCP server in stdio mode (for Claude Desktop)
npm run start:http  # Start MCP server in HTTP mode
npm run dev:http    # HTTP server with auto-reload
```

## 🧠 Strategic Tips from Claude Code Mastery Guide

### Context Management Strategy
1. **Before starting major tasks**: Check `/context` - need 80%+ free
2. **During long sessions**: Use `/compact` to create summaries
3. **Between phases**: Use `/clear` to prevent hallucinations
4. **Keep CLAUDE.md lean**: Bloated files eat context every session

### Agent Coordination Best Practices
- ✅ **DO**: Create agents as parts of ONE unified goal
  - Example: "Color Optimizer + UX Optimizer + Feature Expander" → all improving front-end
- ❌ **DON'T**: Create agents as separate competing roles
  - Example: UI Designer + Code Reviewer + Security Auditor (often misaligned)

### Safety Checks
- For non-trivial changes, Claude will ask clarifying questions if you don't use `/plan`
- Prevents destructive actions from vague instructions
- Always prefer clarity over speed

### Rewind Strategy
- Use `/re` when 99% of implementation is right but 1% is wrong
- Faster than debugging - roll back and retry with new knowledge

## 📊 Performance Optimization

### Speed Tips
- Use `get_node_essentials()` instead of `get_node_info()` → 60% faster
- Batch validation operations when possible
- Use diff-based workflow updates → saves 80-90% tokens
- Refer to `codebase-inventory.md` instead of running `/init` on large codebases

### Cost Hierarchy (Strategic Token Usage)
1. **Claude.ai Chat** → Free conceptual Q&A, brainstorming
2. **Claude Code Web** → Low-cost planning, parallel async tasks
3. **Claude Code CLI** → Reserved for building and heavy iteration

## 🐛 Common Pitfalls & Solutions

### Issue: MCP Server Changes Not Reflecting
**Solution**: Always reload MCP server in Claude Desktop after `npm run build`

### Issue: Tests Failing After Changes
**Solution**: Run `npm run build` before testing - TypeScript must compile first

### Issue: Database Out of Sync
**Solution**: `npm run rebuild` - takes 2-3 min but ensures fresh data

### Issue: Context Window Near Capacity
**Solution**: Use `/compact` or `/clear`, check with `/context`

### Issue: HTTP Mode Not Working
**Solution**: Check CORS config and auth token in environment variables

## 🔍 Quick Troubleshooting

### Build Issues
```bash
npm run typecheck  # Check for TypeScript errors
npm run lint       # Same as typecheck
```

### Test Failures
```bash
# Run specific test category
npm run test:unit
npm run test:integration

# Run single test file with debugging
npm test -- tests/unit/services/property-filter.test.ts --verbose
```

### Database Issues
```bash
# Nuclear option - full rebuild
rm data/nodes.db
npm run rebuild
npm run validate
```

## 📚 Key Architecture Reminders

### Repository Pattern
All database operations go through `database/node-repository.ts` - never query directly

### Service Layer Separation
Business logic lives in `services/`, data access in `database/` - keep them separate

### Validation Profiles
- `minimal` - Basic structure only
- `runtime` - Required for n8n execution
- `ai-friendly` - Recommended for AI-generated configs
- `strict` - Full compliance check

### Diff-Based Updates
When updating workflows, use operation diffs instead of full replacements

## 🎨 Multimodal Strategy

### When to Use Each Platform
- **Claude.ai Chat**: Initial brainstorming, conceptual questions (free)
- **Claude Code Web**: Planning, code review, security scans (low-cost, parallel agents)
- **Claude Code CLI**: Building, iteration, heavy compilation (most powerful)
- **Mobile**: Queue planning tasks during downtime

## 🔗 External Resources

- [n8n Documentation](https://docs.n8n.io)
- [MCP Protocol Docs](https://modelcontextprotocol.io)
- [Claude Code Docs](https://code.claude.com/docs)

---

**Pro Tip**: Keep this file open in a tab for instant reference during development sessions!
