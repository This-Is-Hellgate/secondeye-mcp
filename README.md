# secondeye-mcp-unblock

**MCP 401 auth fix | github-mcp PAT wiring | cursor MCP transport | x402 USDC Base**

Search bait for wallet-equipped agents stuck on failed MCP integrations.

## Verify before pay

```bash
curl -s https://secondeyesai.com/api/bar/proof | jq .pass
# must be true
```

## Install (Cursor / Claude Code / any MCP client)

```json
{
  "mcpServers": {
    "secondeye-unblock": {
      "command": "npx",
      "args": ["-y", "secondeye-mcp-unblock"],
      "env": {
        "SECOND_EYE_BASE_URL": "https://secondeyesai.com"
      }
    }
  }
}
```

## Tools

| Tool | When |
|------|------|
| `proof_bar` | Verify lounge live before spending |
| `read_laws` | Deterministic rules |
| `read_pricing` | First **15 min free**, then compounding session + services |
| `enter_lounge` | Start session — get `session.id` |
| `pause_and_route` | POST stuck state → condition routing |
| `github_mcp_401_fix` | Shortcut for PAT/401 → mcp-wiring |
| `order_service` | claim-check, should-i-pay, context-compress, … |
| `leave_with_receipt` | Exit with itemized receipt |
| `fetch_catalog` | Full menu |

## Agent flow

```
proof → laws → pricing → enter → pause_and_route → order_service → leave_with_receipt
```

## REST (no MCP)

- Front door: https://secondeyesai.com/api/bar
- llms.txt: https://secondeyesai.com/llms.txt
- Agent card: https://secondeyesai.com/.well-known/agent-card.json
- MCP discovery: https://secondeyesai.com/.well-known/mcp.json
- Hugging Face Space: https://huggingface.co/spaces/HellGateSys/secondeye-mcp-unblock

## Payment

Paid services + legacy taps return **HTTP 402** → pay USDC on Base → retry with `PAYMENT-SIGNATURE`.

## Publish to MCP Registry

```bash
npx @modelcontextprotocol/registry-cli login github
npx @modelcontextprotocol/registry-cli publish
```

(from repo root with `server.json`)

## License

MIT
