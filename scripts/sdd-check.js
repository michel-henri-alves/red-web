const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const requiredFiles = [
  'docs/sdd/constitution.md',
  'docs/sdd/agents.md',
  'docs/sdd/context-map.md',
  'docs/sdd/mcp.md',
  'docs/sdd/operation-manual.md',
  'docs/sdd/quality-gates.md',
  'docs/sdd/skills.md',
  'docs/sdd/workflow.md',
  'ai/context/frontend.md',
  'ai/prompts/implement-from-spec.md',
  'package.json'
];

const failures = [];
const warnings = [];

const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`Missing required file: ${relativePath}`);
  }
}

function listMarkdownFiles(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs.readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(relativeDir, entry.name));
}

function checkPackageScripts() {
  const packageJson = JSON.parse(read('package.json'));
  const scripts = packageJson.scripts || {};

  ['build', 'lint', 'test', 'contracts:check', 'sdd:new', 'sdd:new:translate', 'sdd:new:ai', 'sdd:agent', 'sdd:agents', 'sdd:check', 'sdd:estimate', 'sdd:run'].forEach((scriptName) => {
    if (!scripts[scriptName]) {
      fail(`package.json is missing script: ${scriptName}`);
    }
  });

  if (!scripts.test) {
    warn('package.json has no test script; add one when a frontend test runner is configured');
  }
}

function extractReqIds(content) {
  return [...content.matchAll(/\bREQ-[A-Z0-9-]+-\d{3}\b/g)].map((match) => match[0]);
}

function unique(values) {
  return [...new Set(values)];
}

function isCriticalFeature(specContent) {
  const criticality = specContent.match(/## Criticality\s+([\s\S]*?)(?:\n## |\n$)/)?.[1] || '';
  return /\bcritical\b/i.test(criticality);
}

function hasConcreteTestFile(planContent) {
  const testsSection = planContent.match(/## Tests\s+([\s\S]*?)(?:\n## |\n$)/)?.[1] || '';
  return /`[^`]+\.(?:test|spec)\.(?:jsx?|tsx?)`/.test(testsSection);
}

function hasClarificationMarker(content) {
  return /\[(?:NEEDS CLARIFICATION|PRECISA ESCLARECER):[^\]]+\]/i.test(content);
}

function extractTaskIds(content) {
  return [...content.matchAll(/\bT\d{3}\b/g)].map((match) => match[0]);
}

function hasTaskMetadata(content) {
  return /Agent:/i.test(content) && /Depends on:/i.test(content) && /Verification:/i.test(content);
}

function extractSection(content, sectionName) {
  const escapedSectionName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sectionPattern = new RegExp(`^##\\s+${escapedSectionName}\\s*$`, 'im');
  const sectionMatch = content.match(sectionPattern);

  if (!sectionMatch || sectionMatch.index === undefined) {
    return null;
  }

  const start = sectionMatch.index + sectionMatch[0].length;
  const rest = content.slice(start);
  const nextSectionMatch = rest.match(/^##\s+/m);
  const end = nextSectionMatch && nextSectionMatch.index !== undefined
    ? start + nextSectionMatch.index
    : content.length;

  return content.slice(start, end).trim();
}

function normalizeImpactValue(value) {
  return value.trim().toLowerCase();
}

function parseImpactClassification(content) {
  const section = extractSection(content, 'Impact Classification');
  if (!section) {
    return null;
  }

  const fields = {};
  [...section.matchAll(/^\s*-\s*([^:\n]+):\s*(.+?)\s*$/gm)].forEach((match) => {
    fields[match[1].trim().toLowerCase()] = normalizeImpactValue(match[2]);
  });

  const docs = [...section.matchAll(/`(docs\/(?:specs|tasks|memory)\/[^`]+\.md)`/g)]
    .map((match) => match[1]);

  return { fields, docs, section };
}

function isYes(value) {
  return value === 'yes' || value === 'sim' || value === 'true';
}

function hasIncompleteTasks(content) {
  return /^\s*-\s*\[\s\]\s*T\d{3}\b/m.test(content);
}

function checkFeatureImpact(featureDir, spec, plan, tasks) {
  const classification = parseImpactClassification(spec);
  if (!classification) {
    warn(`Feature ${featureDir} spec.md has no Impact Classification section; add it when the feature is touched`);
    return;
  }

  const requiredFields = [
    'impact',
    'creates new domain/workflow',
    'changes domain model',
    'changes public api contract',
    'changes durable architecture/project memory'
  ];

  requiredFields.forEach((field) => {
    if (!classification.fields[field]) {
      fail(`Feature ${featureDir} Impact Classification is missing field: ${field}`);
    }
  });

  if (
    classification.fields.impact &&
    !['low', 'medium', 'high'].includes(classification.fields.impact)
  ) {
    fail(`Feature ${featureDir} Impact Classification has invalid impact: ${classification.fields.impact}`);
  }

  [
    'creates new domain/workflow',
    'changes domain model',
    'changes public api contract',
    'changes durable architecture/project memory'
  ].forEach((field) => {
    const value = classification.fields[field];
    if (value && !['yes', 'no', 'sim', 'nao', 'não', 'true', 'false'].includes(value)) {
      fail(`Feature ${featureDir} Impact Classification field "${field}" must be yes or no`);
    }
  });

  const createsNewDomain = isYes(classification.fields['creates new domain/workflow']);
  const changesDomainModel = isYes(classification.fields['changes domain model']);
  const changesMemory = isYes(classification.fields['changes durable architecture/project memory']);
  const isHighImpact = classification.fields.impact === 'high'
    || createsNewDomain
    || changesDomainModel
    || isYes(classification.fields['changes public api contract'])
    || changesMemory;

  if (!isHighImpact) {
    return;
  }

  const combinedDocs = `${classification.section}\n${plan}\n${tasks}`;
  const completed = !hasIncompleteTasks(tasks);

  if ((createsNewDomain || changesDomainModel) && !/docs\/specs\/[^`\s]+\.md/.test(combinedDocs)) {
    fail(`Feature ${featureDir} is high impact but does not reference a canonical docs/specs/{domain}.spec.md update`);
  }

  if ((createsNewDomain || changesDomainModel) && !/docs\/tasks\/[^`\s]+\.md/.test(combinedDocs)) {
    fail(`Feature ${featureDir} is high impact but does not reference a canonical docs/tasks/{domain}.tasks.md update`);
  }

  if (changesMemory && !combinedDocs.includes('docs/memory/project.memory.md')) {
    fail(`Feature ${featureDir} changes durable project memory but does not reference docs/memory/project.memory.md`);
  }

  if (completed) {
    const referencedDocs = unique([
      ...classification.docs,
      ...[...combinedDocs.matchAll(/`(docs\/(?:specs|tasks|memory)\/[^`]+\.md)`/g)].map((match) => match[1])
    ]);

    referencedDocs.forEach((relativePath) => {
      if (!exists(relativePath)) {
        fail(`Feature ${featureDir} is complete but referenced canonical doc does not exist: ${relativePath}`);
      }
    });
  }
}

function checkTemplateDocs() {
  [
    'docs/features/_template/spec.md',
    'docs/features/_template/plan.md',
    'docs/features/_template/tasks.md'
  ].forEach(requireFile);

  if (exists('docs/features/_template/plan.md')) {
    const planTemplate = read('docs/features/_template/plan.md');
    ['npm run sdd:check', 'npm run test', 'npm run lint', 'npm run build'].forEach((command) => {
      if (!planTemplate.includes(command)) {
        fail(`Feature plan template is missing verification command: ${command}`);
      }
    });

    if (!planTemplate.includes('Definition Of Done')) {
      fail('Feature plan template is missing Definition Of Done section');
    }

    if (!planTemplate.includes('Gate Checks')) {
      fail('Feature plan template is missing Gate Checks section');
    }

    if (!planTemplate.includes('Canonical Documentation')) {
      fail('Feature plan template is missing Canonical Documentation section');
    }
  }

  if (exists('docs/features/_template/spec.md')) {
    const specTemplate = read('docs/features/_template/spec.md');
    ['Impact Classification', 'API/Data Contract', 'Test Strategy', 'MCP Sources'].forEach((section) => {
      if (!specTemplate.includes(section)) {
        fail(`Feature spec template is missing section: ${section}`);
      }
    });
  }
}

function checkAgentDocs() {
  const requiredAgents = [
    'ai/agents/sdd-spec-reviewer.md',
    'ai/agents/sdd-planner.md',
    'ai/agents/implementation-engineer.md',
    'ai/agents/test-engineer.md',
    'ai/agents/code-reviewer.md',
    'ai/agents/performance-cost-reviewer.md'
  ];

  requiredAgents.forEach((agentPath) => {
    requireFile(agentPath);

    if (exists(agentPath) && !read(agentPath).includes('## Objective')) {
      fail(`Agent file is missing an Objective section: ${agentPath}`);
    }
  });
}

function checkSkillDocs() {
  const requiredSkills = [
    'ai/skills/red-web-domain-workflow/SKILL.md',
    'ai/skills/red-web-api-contract/SKILL.md',
    'ai/skills/red-web-auth-session-tenant/SKILL.md',
    'ai/skills/red-web-ui-state-accessibility/SKILL.md',
    'ai/skills/red-web-react-query-testing/SKILL.md',
    'ai/skills/red-web-build-deploy-config/SKILL.md',
    'ai/skills/red-web-sdd-documentation-gate/SKILL.md'
  ];

  requiredSkills.forEach((skillPath) => {
    requireFile(skillPath);

    if (!exists(skillPath)) {
      return;
    }

    const skill = read(skillPath);
    if (!/^---\n[\s\S]*?\n---/m.test(skill)) {
      fail(`Skill file is missing YAML frontmatter: ${skillPath}`);
    }

    ['name:', 'description:', '## Use When', '## Workflow'].forEach((requiredText) => {
      if (!skill.includes(requiredText)) {
        fail(`Skill file ${skillPath} is missing required text: ${requiredText}`);
      }
    });
  });

  if (exists('docs/sdd/skills.md')) {
    const skillsGuide = read('docs/sdd/skills.md');
    requiredSkills.forEach((skillPath) => {
      const skillName = path.basename(path.dirname(skillPath));
      if (!skillsGuide.includes(skillName)) {
        fail(`docs/sdd/skills.md does not reference required skill: ${skillName}`);
      }
    });
  }
}

function checkFeatureDocs() {
  const featuresDir = path.join(root, 'docs/features');
  if (!fs.existsSync(featuresDir)) {
    fail('Missing docs/features directory');
    return;
  }

  const featureDirs = fs.readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory() || entry.name.startsWith('_')) {
        return false;
      }

      const featurePath = path.join(featuresDir, entry.name);
      return fs.readdirSync(featurePath).some((fileName) => fileName.endsWith('.md'));
    })
    .map((entry) => entry.name);

  if (featureDirs.length === 0) {
    warn('No feature folders found in docs/features');
  }

  featureDirs.forEach((featureDir) => {
    ['spec.md', 'plan.md', 'tasks.md'].forEach((fileName) => {
      const relativePath = `docs/features/${featureDir}/${fileName}`;
      if (!exists(relativePath)) {
        fail(`Feature ${featureDir} is missing ${fileName}`);
      }
    });

    const specPath = `docs/features/${featureDir}/spec.md`;
    const planPath = `docs/features/${featureDir}/plan.md`;
    const tasksPath = `docs/features/${featureDir}/tasks.md`;

    if (exists(specPath)) {
      const spec = read(specPath);
      const specReqIds = unique(extractReqIds(spec));
      if (specReqIds.length === 0) {
        fail(`Feature ${featureDir} spec.md has no REQ-* requirement ids`);
      }

      if (exists(tasksPath)) {
        const taskReqIds = unique(extractReqIds(read(tasksPath)));
        specReqIds.forEach((reqId) => {
          if (!taskReqIds.includes(reqId)) {
            fail(`Feature ${featureDir} tasks.md does not reference ${reqId}`);
          }
        });
      }

      if (isCriticalFeature(spec) && exists(planPath) && exists(tasksPath)) {
        const plan = read(planPath);
        const tasks = read(tasksPath);

        if (!hasConcreteTestFile(plan)) {
          fail(`Critical feature ${featureDir} plan.md must list focused test files under ## Tests`);
        }

        specReqIds.forEach((reqId) => {
          const taskLines = tasks.split(/\r?\n/).filter((line) => line.includes(reqId));
          if (!taskLines.some((line) => /test|verification/i.test(line))) {
            fail(`Critical feature ${featureDir} tasks.md must include test or verification task for ${reqId}`);
          }
        });
      }

      if (exists(planPath) && exists(tasksPath)) {
        checkFeatureImpact(featureDir, spec, read(planPath), read(tasksPath));
      }
    }

    if (exists(tasksPath)) {
      const tasks = read(tasksPath);
      if (!/REQ-[A-Z0-9-]+/.test(tasks)) {
        fail(`Feature ${featureDir} tasks.md has no REQ-* requirement ids`);
      }

      const taskIds = unique(extractTaskIds(tasks));
      if (taskIds.length === 0) {
        warn(`Feature ${featureDir} tasks.md has no Txxx task ids; migrate to incremental SDD tasks when the feature is touched`);
      } else if (!hasTaskMetadata(tasks)) {
        fail(`Feature ${featureDir} tasks.md uses Txxx ids but is missing Agent, Depends on, or Verification metadata`);
      }
    }

    if (exists(planPath)) {
      const plan = read(planPath);
      ['npm run sdd:check', 'npm run test', 'npm run lint', 'npm run build'].forEach((command) => {
        if (!plan.includes(command)) {
          fail(`Feature ${featureDir} plan.md is missing verification command: ${command}`);
        }
      });

      const plannedFiles = [...plan.matchAll(/`([^`]+\.(?:jsx?|json|md|css|mjs))`/g)]
        .map((match) => match[1])
        .filter((relativePath) => !relativePath.startsWith('path/to/'))
        .filter((relativePath) => !relativePath.startsWith('npm '));

      plannedFiles.forEach((relativePath) => {
        if (!exists(relativePath)) {
          warn(`Feature ${featureDir} plan references a file that does not exist yet: ${relativePath}`);
        }
      });
    }
  });
}

function checkManualFollowUp() {
  const manualPatterns = [
    /not specified/i,
    /not defined yet/i,
    /no known risks yet/i,
    /files to be identified/i,
    /domain spec\/task files to be identified/i,
    /define if the feature/i,
    /to be identified during implementation/i,
    /TODO/i,
    /TBD/i
  ];

  const featureRoot = path.join(root, 'docs/features');
  if (!fs.existsSync(featureRoot)) {
    return;
  }

  fs.readdirSync(featureRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .forEach((entry) => {
      ['spec.md', 'plan.md', 'tasks.md'].forEach((fileName) => {
        const relativePath = `docs/features/${entry.name}/${fileName}`;
        if (!exists(relativePath)) {
          return;
        }

        const content = read(relativePath);
        if (manualPatterns.some((pattern) => pattern.test(content))) {
          warn(`Manual follow-up required: ${relativePath} still contains placeholders or incomplete SDD fields`);
        }
      });
    });
}

function checkClarificationBlockers() {
  const featureRoot = path.join(root, 'docs/features');
  if (!fs.existsSync(featureRoot)) {
    return;
  }

  fs.readdirSync(featureRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .forEach((entry) => {
      ['spec.md', 'plan.md', 'tasks.md'].forEach((fileName) => {
        const relativePath = `docs/features/${entry.name}/${fileName}`;
        if (exists(relativePath) && hasClarificationMarker(read(relativePath))) {
          fail(`Feature ${entry.name} has unresolved clarification marker in ${fileName}`);
        }
      });
    });
}

function checkDomainSpecs() {
  const specFiles = listMarkdownFiles('docs/specs');
  const taskFiles = listMarkdownFiles('docs/tasks');
  const taskNames = new Set(taskFiles.map((file) => path.basename(file).replace(/\.tasks?\.md$/, '')));

  specFiles.forEach((specFile) => {
    const domainName = path.basename(specFile).replace(/\.spec\.md$/, '').replace(/\.delta\.md$/, '');
    if (specFile.endsWith('.delta.md')) {
      return;
    }

    if (!taskNames.has(domainName)) {
      fail(`Domain spec ${specFile} has no matching docs/tasks/${domainName}.tasks.md`);
    }
  });
}

function checkKnownContracts() {
  if (exists('docs/specs/pos.spec.md')) {
    const posSpec = read('docs/specs/pos.spec.md');
    const requiredRefs = [
      'src/pages/pos/PosPage.jsx',
      'src/components/CartTable.jsx',
      'src/hooks/useCart.jsx',
      'src/hooks/useBarcodeScanner.jsx'
    ];

    requiredRefs.forEach((relativePath) => {
      if (!exists(relativePath)) {
        fail(`POS spec references missing implementation file: ${relativePath}`);
      }
    });

    if (!posSpec.includes('GET /products/by-smartcode/{smartCode}')) {
      warn('POS spec does not mention the backend smart-code lookup contract');
    }
  }

  if (!exists('src/RouteConfig.jsx')) {
    fail('Missing route configuration: src/RouteConfig.jsx');
  }
}

requiredFiles.forEach(requireFile);
checkTemplateDocs();
checkSkillDocs();

if (exists('package.json')) {
  checkPackageScripts();
}

checkFeatureDocs();
checkManualFollowUp();
checkClarificationBlockers();
checkDomainSpecs();
checkKnownContracts();
checkAgentDocs();

if (warnings.length) {
  console.log('SDD warnings:');
  warnings.forEach((message) => console.log(`- ${message}`));
}

if (failures.length) {
  console.error('SDD check failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('SDD check passed.');
