const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const agentsDir = path.join(root, 'ai/agents');

const recommendedOrder = [
  'sdd-spec-reviewer.md',
  'sdd-planner.md',
  'implementation-engineer.md',
  'test-engineer.md',
  'code-reviewer.md',
  'performance-cost-reviewer.md'
];

function readAgentTitle(fileName) {
  const content = fs.readFileSync(path.join(agentsDir, fileName), 'utf8');
  const title = content.match(/^#\s+(.+)$/m)?.[1] || fileName;
  const objective = content.match(/^## Objective\n([\s\S]*?)(?:\n## |\n$)/m)?.[1]
    ?.trim()
    ?.replace(/\s+/g, ' ');

  return { title, objective };
}

function main() {
  if (!fs.existsSync(agentsDir)) {
    console.error('Missing ai/agents directory.');
    process.exit(1);
  }

  console.log('SDD agents for red-web');
  console.log('');
  console.log('Recommended sequence:');

  recommendedOrder.forEach((fileName, index) => {
    const relativePath = `ai/agents/${fileName}`;
    const absolutePath = path.join(root, relativePath);

    if (!fs.existsSync(absolutePath)) {
      console.log(`${index + 1}. Missing: ${relativePath}`);
      return;
    }

    const agent = readAgentTitle(fileName);
    console.log(`${index + 1}. ${agent.title}`);
    console.log(`   File: ${relativePath}`);
    if (agent.objective) {
      console.log(`   Objective: ${agent.objective}`);
    }
  });

  console.log('');
  console.log('Orchestration guide: docs/sdd/agents.md');
}

main();
