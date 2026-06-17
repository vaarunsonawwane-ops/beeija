# Beeija Pricing Audit — 18 June 2026

All eight provider-specific calculators were checked against official provider documentation immediately before this package was created.

## Verified calculators and built-in rates

### OpenAI API Cost Calculator
- GPT-5.5: input $5.00, cached input $0.50, output $30.00 per 1M tokens.
- GPT-5.4: input $2.50, cached input $0.25, output $15.00.
- GPT-5.4 mini: input $0.75, cached input $0.075, output $4.50.
- Batch API: 50% lower input and output prices.
- Standard rates shown apply to context lengths under 270K tokens.
- Official source: https://openai.com/api/pricing/

### Claude API Cost Calculator
- Claude Opus 4.8: input $5, 5m cache write $6.25, 1h cache write $10, cache read $0.50, output $25.
- Claude Sonnet 4.6: input $3, 5m cache write $3.75, 1h cache write $6, cache read $0.30, output $15.
- Claude Haiku 4.5: input $1, 5m cache write $1.25, 1h cache write $2, cache read $0.10, output $5.
- Batch API: 50% lower input and output prices.
- US-only inference: 1.1x; global routing is the standard baseline.
- Official source: https://platform.claude.com/docs/en/about-claude/pricing

### Gemini API Cost Calculator
- Gemini 2.5 Pro: standard <=200K input $1.25, cached $0.125, output $10; >200K input $2.50, cached $0.25, output $15.
- Gemini 2.5 Flash: input $0.30, cached $0.03, output $2.50.
- Gemini 2.5 Flash-Lite: input $0.10, cached $0.01, output $0.40.
- Official Batch rates retained exactly as listed by Google.
- Official source: https://ai.google.dev/gemini-api/docs/pricing

### DeepSeek API Cost Calculator
- DeepSeek V4 Flash: cache hit $0.0028, cache miss $0.14, output $0.28 per 1M tokens.
- DeepSeek V4 Pro: cache hit $0.003625, cache miss $0.435, output $0.87.
- Official source: https://api-docs.deepseek.com/quick_start/pricing

### Grok API Cost Calculator
- Grok 4.3: input $1.25, cached $0.20, output $2.50 per 1M tokens.
- Grok 4.20 0309 Non-Reasoning: input $1.25, cached $0.20, output $2.50.
- Grok Build 0.1: input $1.00, cached $0.20, output $2.00.
- Built-in values are for standard-context requests up to 200K tokens.
- Official source: https://docs.x.ai/developers/models

### Mistral API Cost Calculator
- Mistral Large 3 v25.12: input $0.50, output $1.50 per 1M tokens.
- Mistral Medium 3.5 v26.04: input $1.50, output $7.50.
- Codestral: input $0.30, output $0.90.
- Batch processing: 50% discount.
- Official source: https://mistral.ai/pricing/

### Perplexity API Cost Calculator
- Sonar: input $1, output $1; request fee $5/$8/$12 per 1K for low/medium/high context.
- Sonar Pro: input $3, output $15; request fee $6/$10/$14.
- Sonar Reasoning Pro: input $2, output $8; request fee $6/$10/$14.
- Sonar Deep Research: input $2, output $8, citation $2 per 1M; search queries $5 per 1K; reasoning $3 per 1M.
- Official source: https://docs.perplexity.ai/docs/getting-started/pricing

### Cohere API Cost Calculator
- Command A (`command-a-03-2025`): input $2.50, output $10 per 1M tokens.
- Command R+ (`command-r-plus-08-2024`): input $2.50, output $10.
- Command R (`command-r-08-2024`): input $0.15, output $0.60.
- Command R7B (`command-r7b-12-2024`): input $0.0375, output $0.15.
- All four model IDs are listed as live.
- Official sources: https://docs.cohere.com/docs/models and individual official model pages.

## Provider-independent calculators
- AI Token Cost Calculator stores no provider rate. It uses only user-entered prices.
- AI Image Generation Cost Calculator stores no provider rate. It uses only user-entered prices.
- Their notices were corrected so they do not falsely claim that built-in prices were checked.

## Files
Each tool folder contains a complete `page.tsx` and `ToolClient.tsx`.
The package also includes the updated shared `BeeijaCalculatorResultPanel.tsx` needed for truthful custom-pricing notices.
