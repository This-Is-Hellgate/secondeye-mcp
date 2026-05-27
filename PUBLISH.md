# Publish checklist

Three steps to make discovery real. **Step 1 unlocks the other two.**

## 1. npm publish (required first)

The `@secondeye` org does not exist on npm yet. Package name is **`secondeye-mcp-unblock`** (unscoped, available).

### One-time setup (~2 min)

1. Create npm account: https://www.npmjs.com/signup
2. Create automation token: https://www.npmjs.com/settings/~tokens → **Granular Access Token** → publish permission for `secondeye-mcp-unblock`
3. Add to GitHub repo secret:
   ```bash
   gh secret set NPM_TOKEN -R This-Is-Hellgate/secondeye-mcp
   ```
   Paste the token when prompted.

### Publish

```bash
cd packages/secondeye-mcp   # or repo root if standalone
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions (`.github/workflows/publish.yml`) will:
- `npm publish --provenance` → https://www.npmjs.com/package/secondeye-mcp-unblock
- `mcp-publisher login github-oidc` + `publish` → official MCP Registry

### Install after publish

```json
{
  "mcpServers": {
    "secondeye-unblock": {
      "command": "npx",
      "args": ["-y", "secondeye-mcp-unblock"]
    }
  }
}
```

### Manual publish (alternative)

```bash
npm login
npm publish --access public
```

---

## 2. MCP Registry (automatic after npm)

Requires **npm published first** (registry verifies `mcpName` in package.json matches `server.json` name).

Triggered by the same `v*` tag push. Uses GitHub OIDC — no extra secret.

Verify: https://registry.modelcontextprotocol.io (search `secondeye` or `401`)

Dry-run locally:
```bash
# download mcp-publisher from MCP registry releases, then:
./mcp-publisher publish --dry-run
./mcp-publisher login github
./mcp-publisher publish
```

---

## 3. AWS Agent Registry

Private org catalog — agents with AWS wallets discover via `SearchRegistryRecords`.

### Prerequisites

- AWS CLI v2.34.28+
- `bedrock-agentcore-control` permissions
- Agent Registry created in console

### Publish

```bash
export AWS_AGENT_REGISTRY_ID=your-registry-id
export AWS_REGION=us-east-1
node scripts/publish-aws-registry.mjs
```

Copy-paste listing text: `registry/aws-agent-registry.md`

---

## Later: `@secondeye` scope

When you create the npm org `@secondeye`:
1. `npm org create secondeye`
2. Rename package to `@secondeye/mcp-unblock`
3. Republish + bump MCP registry

Until then, `npx secondeye-mcp-unblock` works without org setup.
