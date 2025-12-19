#!/usr/bin/env ts-node
/**
 * Workflow Analysis Script
 * Analyzes the Instagram Carousel Generator workflow and identifies optimization opportunities
 */

import * as fs from 'fs';
import * as path from 'path';

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters?: any;
  credentials?: any;
  retryOnFail?: boolean;
  continueOnFail?: boolean;
  disabled?: boolean;
}

interface WorkflowConnection {
  node: string;
  type: string;
  index: number;
}

interface Workflow {
  name: string;
  nodes: WorkflowNode[];
  connections: Record<string, Record<string, WorkflowConnection[][]>>;
  settings?: any;
}

interface AnalysisReport {
  summary: {
    totalNodes: number;
    totalConnections: number;
    llmNodes: number;
    codeNodes: number;
    phases: string[];
  };
  issues: {
    category: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    affectedNodes: string[];
    recommendation: string;
  }[];
  optimization: {
    parallelizationOpportunities: string[][];
    costSavings: {
      area: string;
      potential: string;
      nodes: string[];
    }[];
  };
}

function analyzeWorkflow(workflowPath: string): AnalysisReport {
  const workflow: Workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));

  const report: AnalysisReport = {
    summary: {
      totalNodes: workflow.nodes.length,
      totalConnections: Object.keys(workflow.connections).length,
      llmNodes: 0,
      codeNodes: 0,
      phases: []
    },
    issues: [],
    optimization: {
      parallelizationOpportunities: [],
      costSavings: []
    }
  };

  // Count node types
  const llmTypes = ['langchain', 'openai', 'anthropic', 'gemini', 'groq'];
  workflow.nodes.forEach(node => {
    if (llmTypes.some(type => node.type.toLowerCase().includes(type))) {
      report.summary.llmNodes++;
    }
    if (node.type === 'n8n-nodes-base.code') {
      report.summary.codeNodes++;
    }
  });

  // Analyze retry configuration
  const nodesWithoutRetry = workflow.nodes.filter(node =>
    llmTypes.some(type => node.type.toLowerCase().includes(type)) &&
    !node.retryOnFail
  );

  if (nodesWithoutRetry.length > 0) {
    report.issues.push({
      category: 'Reliability',
      severity: 'critical',
      description: 'LLM nodes without retry logic',
      affectedNodes: nodesWithoutRetry.map(n => n.name),
      recommendation: 'Enable retryOnFail with 3-5 attempts and exponential backoff'
    });
  }

  // Analyze token configuration
  const nodesWithoutTokenLimit = workflow.nodes.filter(node => {
    if (!llmTypes.some(type => node.type.toLowerCase().includes(type))) return false;
    const params = node.parameters?.options || {};
    return !params.maxTokensToSample && !params.maxOutputTokens;
  });

  if (nodesWithoutTokenLimit.length > 0) {
    report.issues.push({
      category: 'Cost Optimization',
      severity: 'high',
      description: 'LLM nodes without token limits',
      affectedNodes: nodesWithoutTokenLimit.map(n => n.name),
      recommendation: 'Set maxTokens based on task complexity (500-4000)'
    });

    report.optimization.costSavings.push({
      area: 'Token Optimization',
      potential: '30-40% cost reduction',
      nodes: nodesWithoutTokenLimit.map(n => n.name)
    });
  }

  // Analyze parallelization opportunities
  const agentNodes = workflow.nodes.filter(node =>
    node.type.includes('agent') || node.type.includes('chain')
  );

  // Find independent agents (those that don't depend on each other's output)
  const independentGroups: string[][] = [];
  const designers = agentNodes.filter(n =>
    n.name.includes('Designer') || n.name.includes('Creator')
  );

  if (designers.length > 1) {
    independentGroups.push(designers.map(n => n.name));
    report.optimization.parallelizationOpportunities.push(
      designers.map(n => n.name)
    );
  }

  // Analyze provider diversity
  const providers: Record<string, number> = {};
  workflow.nodes.forEach(node => {
    if (node.type.includes('Anthropic')) providers['Anthropic'] = (providers['Anthropic'] || 0) + 1;
    if (node.type.includes('OpenAi')) providers['OpenAI'] = (providers['OpenAI'] || 0) + 1;
    if (node.type.includes('Groq')) providers['Groq'] = (providers['Groq'] || 0) + 1;
    if (node.type.includes('Gemini')) providers['Gemini'] = (providers['Gemini'] || 0) + 1;
  });

  if (Object.keys(providers).length > 2) {
    report.issues.push({
      category: 'Cost Optimization',
      severity: 'medium',
      description: 'Multiple LLM providers used',
      affectedNodes: [`${Object.keys(providers).length} different providers`],
      recommendation: 'Consolidate to 1-2 providers for better rate limits and cost'
    });

    report.optimization.costSavings.push({
      area: 'Provider Consolidation',
      potential: '15-20% cost reduction',
      nodes: Object.entries(providers).map(([k, v]) => `${k}: ${v} nodes`)
    });
  }

  // Analyze documentation
  const stickyNotes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
  const ratio = stickyNotes.length / workflow.nodes.length;

  if (ratio < 0.05) {
    report.issues.push({
      category: 'Maintainability',
      severity: 'medium',
      description: 'Insufficient documentation',
      affectedNodes: [`Only ${stickyNotes.length} sticky notes for ${workflow.nodes.length} nodes`],
      recommendation: 'Add sticky notes for each major phase and complex logic blocks'
    });
  }

  return report;
}

function generateImprovementPlan(report: AnalysisReport): void {
  console.log('\n=== WORKFLOW ANALYSIS REPORT ===\n');

  console.log('📊 SUMMARY:');
  console.log(`  Total Nodes: ${report.summary.totalNodes}`);
  console.log(`  LLM Nodes: ${report.summary.llmNodes}`);
  console.log(`  Code Nodes: ${report.summary.codeNodes}`);
  console.log(`  Connections: ${report.summary.totalConnections}\n`);

  console.log('🚨 ISSUES FOUND:\n');
  report.issues.forEach((issue, i) => {
    const severityEmoji = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    console.log(`${i + 1}. ${severityEmoji[issue.severity]} [${issue.severity.toUpperCase()}] ${issue.category}`);
    console.log(`   ${issue.description}`);
    console.log(`   Affected: ${issue.affectedNodes.length} nodes`);
    console.log(`   ✅ Recommendation: ${issue.recommendation}\n`);
  });

  console.log('💰 COST SAVINGS OPPORTUNITIES:\n');
  report.optimization.costSavings.forEach((saving, i) => {
    console.log(`${i + 1}. ${saving.area}`);
    console.log(`   Potential: ${saving.potential}`);
    console.log(`   Nodes: ${saving.nodes.length}\n`);
  });

  console.log('⚡ PARALLELIZATION OPPORTUNITIES:\n');
  report.optimization.parallelizationOpportunities.forEach((group, i) => {
    console.log(`${i + 1}. Group of ${group.length} independent nodes:`);
    group.forEach(node => console.log(`   - ${node}`));
    console.log();
  });
}

// Main execution
const workflowPath = path.join(__dirname, '..', 'Gerador de Carrosséis Instagram.json');

if (!fs.existsSync(workflowPath)) {
  console.error('❌ Workflow file not found:', workflowPath);
  process.exit(1);
}

const report = analyzeWorkflow(workflowPath);
generateImprovementPlan(report);

// Export report
const reportPath = path.join(__dirname, '..', 'workflow-analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 Full report saved to: ${reportPath}\n`);
