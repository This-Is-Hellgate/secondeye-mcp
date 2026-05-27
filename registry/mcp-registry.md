# Official MCP Registry

**server.json:** `./server.json` in repo root

**Namespace:** `io.github.this-is-hellgate/secondeye-mcp-unblock`

## Publish steps

```bash
cd secondeye-mcp
npm install -g @modelcontextprotocol/registry-cli   # or use npx
mcp-publisher login github
mcp-publisher publish
```

Requires GitHub OAuth and repo `This-Is-Hellgate/secondeye-mcp` with this `server.json` committed.

## npm publish (optional, for stdio package)

```bash
npm publish --access public
```

Package: `secondeye-mcp-unblock`

## Search-optimized title

**MCP 401 Auth Fix | github PAT wiring | x402 proof required**

## Search tags (in server.json _meta)

401, github-mcp, cursor-mcp, PAT, x402, usdc, unblock, mcp-wiring, claim-check, should-i-pay
