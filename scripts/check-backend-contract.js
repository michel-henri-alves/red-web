const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const defaultContractPath = path.resolve(root, '../red-backend/docs/contracts/openapi.json');
const contractPath = process.env.RED_BACKEND_OPENAPI || defaultContractPath;
const apiDir = path.join(root, 'src/shared/api');

function methodPathExists(openApi, method, apiPath) {
  return Boolean(openApi.paths?.[apiPath]?.[method]);
}

function toOpenApiPath(rawPath) {
  return rawPath
    .replace(/\?.*$/, '')
    .replace(/\$\{([^}]+)\}/g, '{$1}')
    .replace(/\/+/g, '/');
}

function extractDomain(content) {
  return content.match(/const\s+DOMAIN\s*=\s*["'`]([^"'`]+)["'`]/)?.[1];
}

function extractCalls(content, domain) {
  const calls = [];
  const pattern = /axiosClient\.(get|post|put|delete|patch)\(([\s\S]*?)\)/g;
  let match;

  while ((match = pattern.exec(content))) {
    const method = match[1];
    const expression = match[2].split(',')[0].trim();
    let endpoint = null;

    if (expression === 'DOMAIN') {
      endpoint = domain;
    } else {
      const template = expression.match(/`([^`]+)`/)?.[1];
      const quoted = expression.match(/^["']([^"']+)["']$/)?.[1];
      endpoint = template || quoted;
      if (endpoint && domain) {
        endpoint = endpoint.replace(/\$\{DOMAIN\}/g, domain);
      }
    }

    if (endpoint?.startsWith('/')) {
      calls.push({ method, path: toOpenApiPath(endpoint) });
    }
  }

  return calls;
}

function main() {
  if (!fs.existsSync(contractPath)) {
    console.error(`Backend OpenAPI contract not found: ${contractPath}`);
    console.error('Set RED_BACKEND_OPENAPI or run this from the local red workspace with red-backend beside red-web.');
    process.exit(1);
  }

  const openApi = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const failures = [];

  fs.readdirSync(apiDir)
    .filter((fileName) => fileName.endsWith('Api.js'))
    .forEach((fileName) => {
      const relativePath = `src/shared/api/${fileName}`;
      const content = fs.readFileSync(path.join(root, relativePath), 'utf8');
      const domain = extractDomain(content);

      extractCalls(content, domain).forEach((call) => {
        if (!methodPathExists(openApi, call.method, call.path)) {
          failures.push(`${relativePath}: ${call.method.toUpperCase()} ${call.path} is missing from backend contract`);
        }
      });
    });

  if (failures.length) {
    console.error('Backend contract check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log('Backend contract check passed.');
}

main();
