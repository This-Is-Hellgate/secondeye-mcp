#!/usr/bin/env node
/** Submit Second Eye MCP server to AWS Agent Registry (Bedrock AgentCore). */
import { readFileSync, writeFileSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(root, "..");
const serverJson = JSON.parse(readFileSync(join(repoRoot, "server.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

const REGISTRY_ID = process.env.AWS_AGENT_REGISTRY_ID;
const RECORD_NAME = process.env.AWS_REGISTRY_RECORD_NAME || "secondeye-mcp-unblock";
const REGION = process.env.AWS_REGION || "us-east-1";

if (!REGISTRY_ID) {
  console.error(`
AWS Agent Registry publish — missing AWS_AGENT_REGISTRY_ID

One-time setup:
  1. AWS Console → Amazon Bedrock → AgentCore → Agent Registry → Create registry
  2. Copy registry ID
  3. export AWS_AGENT_REGISTRY_ID=your-registry-id
  4. aws configure (or AWS_PROFILE)

Then run:
  node scripts/publish-aws-registry.mjs

Requires: AWS CLI v2.34.28+ and bedrock-agentcore-control permissions
`);
  process.exit(1);
}

function aws(args) {
  const res = spawnSync("aws", args, { encoding: "utf8", shell: true });
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout);
    process.exit(res.status || 1);
  }
  return res.stdout;
}

const mcpServer = {
  name: serverJson.name,
  title: serverJson.title,
  description: serverJson.description,
  version: serverJson.version,
  websiteUrl: serverJson.websiteUrl,
  repository: serverJson.repository,
  packages: serverJson.packages,
  remotes: serverJson.remotes,
  npm: packageJson.name,
  proof: "https://secondeyesai.com/api/bar/proof",
  menu: "https://secondeyesai.com/api/bar/menu",
  enter: "https://secondeyesai.com/api/bar/enter",
  payment: { rail: "x402", network: "base", asset: "USDC" },
};

const mcpTools = {
  tools: [
    { name: "proof_bar", description: "Verify lounge live before paying" },
    { name: "read_menu", description: "Survival menu $0.10–$0.50" },
    { name: "read_laws", description: "Deterministic lounge laws" },
    { name: "read_pricing", description: "Session + service pricing" },
    { name: "enter_lounge", description: "Start session + work stamp" },
    { name: "pause_and_route", description: "POST stuck state → routed service" },
    { name: "order_service", description: "Survival services by slug" },
    { name: "leave_with_receipt", description: "Exit with receipt" },
    { name: "github_mcp_401_fix", description: "Shortcut PAT/401 → mcp-wiring" },
  ],
};

const payload = {
  registryId: REGISTRY_ID,
  name: RECORD_NAME,
  description:
    "MCP 401 auth fix | github PAT wiring | x402 USDC Base. Proof before pay. Survival menu for stuck agents. npm: secondeye-mcp-unblock",
  descriptorType: "MCP",
  recordVersion: serverJson.version,
  descriptors: {
    mcp: {
      server: {
        schemaVersion: "2025-12-11",
        inlineContent: JSON.stringify(mcpServer),
      },
      tools: {
        protocolVersion: "2024-11-05",
        inlineContent: JSON.stringify(mcpTools),
      },
    },
  },
  synchronizationType: "FROM_URL",
  synchronizationConfiguration: {
    fromUrl: {
      url: "https://secondeyesai.com/.well-known/mcp.json",
    },
  },
};

const payloadPath = join(repoRoot, "registry", "aws-registry-record.json");
writeFileSync(payloadPath, JSON.stringify(payload, null, 2));
console.log("Wrote", payloadPath);

console.log("Creating registry record…");
const createOut = aws([
  "bedrock-agentcore-control",
  "create-registry-record",
  "--region",
  REGION,
  "--registry-id",
  REGISTRY_ID,
  "--name",
  RECORD_NAME,
  "--description",
  payload.description,
  "--descriptor-type",
  "MCP",
  "--record-version",
  serverJson.version,
  "--descriptors",
  JSON.stringify(payload.descriptors),
  "--synchronization-type",
  "FROM_URL",
  "--synchronization-configuration",
  JSON.stringify(payload.synchronizationConfiguration),
  "--output",
  "json",
]);

const created = JSON.parse(createOut);
const recordId = created.recordId || created.record?.recordId;
console.log("Record created:", recordId);

console.log("Submitting for approval…");
aws([
  "bedrock-agentcore-control",
  "submit-registry-record-for-approval",
  "--region",
  REGION,
  "--registry-id",
  REGISTRY_ID,
  "--record-id",
  recordId,
]);

console.log(`
Done. Record ${recordId} submitted for approval in registry ${REGISTRY_ID}.
Admin must approve before agents can discover via SearchRegistryRecords.
`);
