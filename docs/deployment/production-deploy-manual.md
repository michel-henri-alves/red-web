# Manual de Deploy em Producao

Este manual descreve como configurar e operar o deploy automatizado dos projetos
`red-database`, `red-backend` e `red-web` usando GitHub Actions, MongoDB Atlas,
AWS Lambda, S3 e CloudFront.

O objetivo e manter uma solucao simples, profissional e com custo zero ou muito
proximo disso.

## 1. Visao Geral

Fluxo recomendado para producao:

```text
merge/push main
  -> red-database: migrations no MongoDB Atlas
  -> red-backend: CI + deploy da Lambda
  -> red-web: CI + build + upload S3 + invalidacao CloudFront
```

Cada repositorio tem sua propria pipeline. Para releases coordenadas, faca merge
nesta ordem:

1. `red-database`
2. `red-backend`
3. `red-web`

## 2. Pre-requisitos

Ferramentas locais uteis:

```bash
git --version
node --version
npm --version
aws --version
```

Servicos necessarios:

- Conta GitHub com acesso aos repositorios.
- MongoDB Atlas com cluster `reddb`.
- AWS Lambda para o backend.
- Bucket S3 para o frontend.
- Distribuicao CloudFront apontando para o bucket.
- IAM OIDC provider para GitHub Actions na AWS.

## 3. GitHub Environment

Crie o environment `production` em cada repositorio:

```text
GitHub repo -> Settings -> Environments -> New environment -> production
```

Recomendado:

- habilitar aprovacao manual para deploy;
- restringir deployment branch para `main`;
- cadastrar os secrets dentro do environment `production`.

## 4. MongoDB Atlas

### 4.1 Network Access

Opcao simples e gratuita:

```text
Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere
0.0.0.0/0
```

Essa opcao funciona com GitHub-hosted runners, que possuem IP variavel. Para
reduzir risco:

- use um usuario dedicado para migrations;
- use senha forte;
- nao use usuario admin;
- limite as permissoes ao banco `reddb`.

### 4.2 Database User

Crie um usuario dedicado:

```text
Database Access -> Add New Database User
User: red_migrations_ci
Role: readWrite em reddb
```

### 4.3 Secret do GitHub

No repositorio `red-database`, adicione:

```text
MONGO_URI
```

Exemplo de valor:

```text
mongodb+srv://red_migrations_ci:SENHA_FORTE@SEU_CLUSTER.mongodb.net/reddb?retryWrites=true&w=majority
```

O script de migrations deve ler a URI por variavel de ambiente:

```js
const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is required");
```

## 5. AWS OIDC Para GitHub Actions

### 5.1 Criar Identity Provider

Na AWS:

```text
IAM -> Identity providers -> Add provider
Provider type: OpenID Connect
Provider URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com
```

### 5.2 Role de Deploy do Backend

Crie uma role propria:

```text
github-actions-red-backend-deploy
```

Trust policy por branch `main`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:GITHUB_OWNER/red-backend:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Inline policy minima:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:GetFunction",
        "lambda:UpdateFunctionCode"
      ],
      "Resource": "arn:aws:lambda:AWS_REGION:ACCOUNT_ID:function:red-backend"
    }
  ]
}
```

### 5.3 Role de Deploy do Frontend

Crie outra role:

```text
github-actions-red-web-deploy
```

Trust policy por branch `main`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:GITHUB_OWNER/red-web:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Inline policy para S3 e CloudFront:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListWebsiteBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::S3_BUCKET_NAME"
    },
    {
      "Sid": "WriteWebsiteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::S3_BUCKET_NAME/*"
    },
    {
      "Sid": "InvalidateCloudFrontCache",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/CLOUDFRONT_DISTRIBUTION_ID"
    }
  ]
}
```

## 6. GitHub Secrets

Cadastre os secrets em:

```text
GitHub repo -> Settings -> Secrets and variables -> Actions
```

Ou, preferencialmente:

```text
GitHub repo -> Settings -> Environments -> production -> Environment secrets
```

### 6.1 red-database

```text
MONGO_URI
```

### 6.2 red-backend

```text
AWS_DEPLOY_ROLE_ARN
AWS_REGION
LAMBDA_FUNCTION_NAME
```

Exemplo:

```text
AWS_DEPLOY_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/github-actions-red-backend-deploy
AWS_REGION=us-east-1
LAMBDA_FUNCTION_NAME=red-backend
```

### 6.3 red-web

```text
AWS_DEPLOY_ROLE_ARN
AWS_REGION
S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID
VITE_API_BASE_URL
```

Exemplo:

```text
AWS_DEPLOY_ROLE_ARN=arn:aws:iam::ACCOUNT_ID:role/github-actions-red-web-deploy
AWS_REGION=us-east-1
S3_BUCKET=red-web-dev
CLOUDFRONT_DISTRIBUTION_ID=E2XHRVYUHIIIIZ
VITE_API_BASE_URL=https://1biotj4t46.execute-api.us-east-1.amazonaws.com
```

Importante: `S3_BUCKET` deve receber apenas o nome do bucket, nao a ARN.
Importante: `VITE_API_BASE_URL` e lido durante `npm run build`; alterar essa
URL exige novo build, upload do `dist/` e invalidacao do CloudFront.
Recomendado: cadastre `VITE_API_BASE_URL` como GitHub Actions variable no
environment `production`; ela nao precisa ser secret porque fica embutida no
JavaScript publico do frontend.

## 7. Workflows

### 7.1 red-database

Workflow recomendado:

```yaml
name: Deploy Database

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - run: npm run migrate
        env:
          MONGO_URI: ${{ secrets.MONGO_URI }}
```

### 7.2 red-backend

O workflow `red-backend/.github/workflows/ci.yml` deve:

- rodar `npm run sdd:check`;
- rodar `npm run openapi:check`;
- rodar `npm run lint`;
- rodar `npm run test:coverage`;
- em `push` para `main`, assumir a role AWS via OIDC;
- empacotar a Lambda;
- executar `aws lambda update-function-code`.

### 7.3 red-web

O workflow `red-web/.github/workflows/sdd-ci.yml` deve:

- rodar `npm run sdd:check`;
- rodar `npm run contracts:check`;
- rodar `npm run test`;
- rodar `npm run build`;
- em `push` para `main`, publicar `dist/` no S3;
- invalidar o cache do CloudFront.

## 8. Como Ativar o Deploy

O deploy e ativado quando o workflow esta commitado na branch `main`.

Backend:

```bash
cd /home/michel/git/michel/red/red-backend
git add .github/workflows/ci.yml
git commit -m "ci: add production backend deploy pipeline"
git push origin main
```

Frontend:

```bash
cd /home/michel/git/michel/red/red-web
git add .github/workflows/sdd-ci.yml
git commit -m "ci: add production frontend deploy pipeline"
git push origin main
```

Database:

```bash
cd /home/michel/git/michel/red/red-database
git add .github/workflows/deploy-database.yml scripts/run-migrations.js
git commit -m "ci: add production database migration pipeline"
git push origin main
```

## 9. Primeiro Deploy

Recomendado para o primeiro deploy:

1. Confirme que todos os secrets existem.
2. Confirme que o environment `production` existe.
3. Confirme que as trust policies apontam para o owner/repo corretos.
4. Faca um push pequeno para `main`.
5. Abra `GitHub -> Actions`.
6. Acompanhe o workflow.
7. Se houver aprovacao manual, clique em `Review deployments` e aprove.

## 10. Validacao Pos-Deploy

Database:

- conferir a collection `migrations`;
- confirmar que novas collections e indexes existem;
- confirmar que dados existentes foram preservados.

Backend:

- conferir no AWS Lambda se `Last modified` mudou;
- chamar um endpoint publico ou autenticado;
- verificar CloudWatch Logs.

Frontend:

- abrir a URL do CloudFront;
- testar login e fluxo principal;
- confirmar que assets novos foram carregados apos invalidacao.

## 11. Problemas Comuns

### Access denied ao assumir role

Verifique:

- `AWS_DEPLOY_ROLE_ARN`;
- trust policy da role;
- `GITHUB_OWNER`;
- nome do repositorio;
- branch `main`;
- se o workflow usa `environment: production`.

### S3 AccessDenied

Verifique:

- `S3_BUCKET` e apenas o nome do bucket;
- policy com `s3:ListBucket` no bucket;
- policy com `s3:PutObject`, `s3:DeleteObject`, `s3:GetObject` em `bucket/*`.

### CloudFront AccessDenied

Verifique:

- `CLOUDFRONT_DISTRIBUTION_ID`;
- ARN da distribution na inline policy;
- permissao `cloudfront:CreateInvalidation`.

### MongoDB timeout ou network error

Verifique:

- Atlas Network Access com `0.0.0.0/0`, ou IP temporario do runner;
- `MONGO_URI`;
- usuario e senha;
- permissao do usuario no banco `reddb`.

## 12. Boas Praticas

- Use roles separadas para backend e frontend.
- Nao use a execution role da Lambda como role de deploy.
- Nao commite `.env`, senhas, URIs ou tokens.
- Use usuario MongoDB dedicado para migrations.
- Use GitHub Environment `production` com aprovacao manual no inicio.
- Mantenha as migrations idempotentes.
- Teste primeiro com `workflow_dispatch` quando disponivel.
- Prefira permissoes AWS minimas por recurso.
