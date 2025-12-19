# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This repository is a **Claude Skills Factory** - a system for generating production-ready skills for Claude Code, Claude.ai, and the Claude API. Skills are specialized capabilities that extend Claude's functionality for specific business domains and use cases.

## Architecture Overview

### Core Components

1. **SKILLS_FACTORY_GENERATOR_PROMPT.md** - The master prompt engineering template that defines how to create complete skill sets. This is a comprehensive system prompt that:
   - Defines skill structure and required components
   - Establishes quality standards for documentation and code
   - Provides templates for SKILL.md files, Python scripts, and sample prompts
   - Supports customization via user configuration variables

2. **Exemplos de habilidades do claude/** - Reference implementations demonstrating skill patterns:
   - **creating-financial-models.md** - Advanced financial modeling (DCF, Monte Carlo, sensitivity analysis)
   - **brand-guidelines** - Corporate branding and styling enforcement
   - **analises_de_demonstracoes_financeiras** - Financial statement analysis with ratio calculations
   - Python scripts (`.py` files) - Production-ready implementations for complex calculations

### Skill Anatomy

Each skill is a self-contained package with:

- **SKILL.md** (required) - Frontmatter with name/description + comprehensive documentation including:
  - Capabilities and use cases
  - Input/output formats
  - Usage examples and best practices
  - Limitations and disclaimers

- **Python scripts** (conditional) - Only when deterministic calculations, data transformations, or API integrations are needed
  - Follow PEP 8 standards
  - Include type hints and comprehensive docstrings
  - Contain example usage in `if __name__ == "__main__"` blocks

- **Test data files** (conditional) - Realistic sample inputs (CSV, JSON, Excel)
  - 10-20 rows maximum
  - Domain-appropriate realistic data

- **sample_prompt.md** (required) - Copy-paste ready prompts demonstrating skill invocation

- **ZIP file** (required) - Contains only SKILL.md for easy import into Claude.ai browser interface

## Skill Generation Configuration

The system accepts these configuration variables:

- **BUSINESS_TYPE** - Industry/domain description
- **BUSINESS_CONTEXT** - Specific needs and focus areas
- **USE_CASES** - Specific tasks requiring skills
- **NUMBER_OF_SKILLS** - How many to generate
- **OVERLAP_PREFERENCE** - "mutually_exclusive" vs "overlapping"
- **COMPLEXITY_LEVEL** - "beginner", "intermediate", or "advanced"
- **PYTHON_PREFERENCE** - "minimal", "balanced", or "extensive"

## Design Principles

1. **Single Responsibility** - Each skill does one thing exceptionally well
2. **Self-Contained** - All resources exist within the skill folder
3. **Composable** - Skills work well together and can be combined
4. **Portable** - Function across Claude.ai, Claude Code, and API
5. **User-Focused** - Designed for end-user workflows, not technical complexity

## Quality Standards

### Documentation
- Clear, concise, and actionable
- Specific about capabilities (avoid vague descriptions)
- Complete (no placeholder text)
- Professional grammar and formatting

### Python Code
- Production-ready with error handling
- Comprehensive docstrings for all functions/classes
- Type hints throughout
- Efficient and PEP 8 compliant

### Test Data
- Realistic and representative
- Minimal (only what's needed)
- Properly formatted and valid

## Naming Conventions

- Skill folders: **kebab-case** (e.g., `financial-ratio-analyzer`)
- Python files: **snake_case** (e.g., `calculate_ratios.py`)
- ZIP files: `[skill-name]-skill.zip`

## Language Usage

The repository contains mixed Portuguese and English content:
- Primary documentation (SKILLS_FACTORY_GENERATOR_PROMPT.md) is in Portuguese
- Skill examples use English for technical content
- File names use both languages

When working with this repository, match the language of the file being edited or generated.
