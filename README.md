# 💡 Passive Income Idea Generator

**Offline passive income product ideas for any niche — no APIs, no keys, no internet required.**

Generate Gumroad course ideas, Etsy product concepts, and AI prompts in seconds. 100% deterministic. 100% offline. Free to use.

## Key Features

🔒 **100% Offline** — Zero network calls, no cloud dependencies, works anywhere  
🔑 **No API Keys** — No authentication, no signup, no accounts required  
🎲 **Deterministic** — Same seed always produces identical results (perfect for workflows)  
📊 **Scored Ideas** — Each idea rated on ease, demand, differentiation, and time-to-ship  
📦 **Dual Output** — Markdown for humans, JSON for automation  
🎯 **Three Income Streams** — Gumroad courses, Etsy products, AI prompts (ChatGPT, Claude, etc.)  

## Quick Demo

Try it now (requires Node.js 18+):

```powershell
git clone https://github.com/yourusername/passive-gen.git
cd passive-gen
npm install && npm run build

node dist/cli.js "your niche here" --out ./ideas --seed 42 --count 5
```

See output in `./ideas/` folder:
- `gumroad_ideas.md` — Course ideas with pricing suggestions
- `etsy_ideas.md` — Product ideas with print-on-demand notes
- `prompts.md` — Prompts ready for ChatGPT/Claude
- `bundle.json` — All data in JSON format
- `README.md` — Market analysis and tips

**View example outputs:** See [/demo-output](./demo-output/) folder.

## Installation

```powershell
# Clone the repository
git clone https://github.com/yourusername/passive-gen.git
cd passive-gen

# Install dependencies
npm install

# Build the project
npm run build

# (Optional) Install globally for direct access
npm install -g .
```

## 💰 Monetization

**This project is free and open-source on GitHub.**

If you prefer a pre-built, ready-to-use Windows executable with no setup required:  
👉 **[Buy on Gumroad](https://gumroad.com/yourusername/l/passive-gen)** — Includes compiled binary, quick-start guide, and priority support

Open-source users: Clone and build locally (it's free).

## Usage

### Basic Command

```powershell
node dist/cli.js "your niche here" --out ./output
```

### Examples

```powershell
# Generate 10 ideas for digital marketing
node dist/cli.js "digital marketing" --out ./ideas

# Generate 20 ideas with a specific seed (reproducible)
node dist/cli.js "dog training" --out ./ideas --seed 42 --count 20

# Export all template categories
node dist/cli.js "blockchain" --templates --out ./templates
```

### Options

```
USAGE:
  passive-gen <niche> [OPTIONS]

ARGUMENTS:
  <niche>          The niche or market to generate ideas for

OPTIONS:
  --out <dir>      Output directory (required)
  --count <n>      Number of ideas per category (default: 10, max: 100)
  --seed <n>       Seed for deterministic generation (optional)
  --templates      Export all template categories
  --help           Show this help message
  --version        Show version number
```

## Output Files

After running the command, you'll get:

- **gumroad_ideas.md** — Gumroad course ideas with pricing notes
- **etsy_ideas.md** — Etsy product ideas with market tips
- **prompts.md** — AI prompts for ChatGPT, Claude, etc.
- **bundle.json** — All data in JSON format with metadata
- **README.md** — Generated guide with niche analysis

### Sample Output Structure

```markdown
# Digital Marketing Ideas

## Gumroad Course Ideas

### Idea 1: [Generated Title]

**Why it will sell:** [Reasoning based on market demand]
**What's included:** [Course structure details]
**Who's it for:** [Target audience description]

**Scores**
| Dimension | Score | Notes |
|-----------|-------|-------|
| Ease | 8/10 | Can be created in 2-3 weeks |
| Demand | 9/10 | High market interest |
| Differentiation | 7/10 | Moderate competition |
| Time to Ship | 6/10 | 4-6 week timeline |

---
```

## Reproducibility

Every run includes metadata for perfect reproducibility:

```json
{
  "niche": "digital marketing",
  "seed": 42,
  "count": 10,
  "generatedAt": "2026-01-21T14:30:00Z",
  "gumroadIdeas": [...],
  "etsyIdeas": [...],
  "prompts": [...]
}
```

**To regenerate identical ideas:** Use the same `--seed` value.

## Development

```powershell
# Run dev mode (without compilation)
npm run dev "test niche" --out ./output

# Run tests
npm test

# Watch mode for tests
npm test:watch

# Run tests with UI
npm run test:ui

# Lint and fix code
npm run lint
```

## Project Structure

```
passive-gen/
├── src/
│   ├── cli.ts           Command-line interface
│   ├── generator.ts     Core generation logic with scoring
│   ├── writer.ts        File output and markdown formatting
│   └── random.ts        Deterministic RNG (seeded)
├── tests/
│   └── generator.test.ts Comprehensive test suite (25+ tests)
├── dist/                Compiled JavaScript output
├── package.json         Project metadata and scripts
├── tsconfig.json        TypeScript configuration
├── vitest.config.ts     Test runner configuration
└── README.md            This file
```

## How It Works

1. **Seeded RNG** — Uses Linear Congruential Generator (LCG) for deterministic randomness
2. **Template System** — 30 templates each for Gumroad, Etsy, and Prompts
3. **Niche Injection** — Substitutes your niche into relevant templates
4. **Scoring** — Automatically scores each idea on four dimensions (1-10)
5. **Output Generation** — Formats as Markdown, JSON, and readable guide

## Constraints & Design

- **Zero-Cost** — No paid APIs, no cloud services, no authentication
- **Offline-Only** — All computation happens locally on your machine
- **Deterministic** — Same inputs = Same outputs (perfect for workflows)
- **Minimal Dependencies** — Only TypeScript, Node.js utilities, and Vitest for testing

## Testing

```powershell
# Run full test suite (25+ tests)
npm test

# Expected output:
# ✓ Generator Tests (13 tests)
# ✓ File Writing Tests (5 tests)
# ✓ Validation Tests (3 tests)
# ✓ Output Validation Tests (4 tests)
# PASS tests/generator.test.ts (123ms)
```

All tests verify:
- Deterministic generation with seeds
- Scoring ranges (1-10)
- File creation and content
- Niche inclusion
- Edge cases (special characters, long names, count limits)
- Guard tests for template escape sequences

## Troubleshooting

### "Command not found: passive-gen"

The CLI hasn't been installed globally. Use:
```powershell
node dist/cli.js "your niche" --out ./output
```

Or install globally:
```powershell
npm install -g .
```

### "Output directory doesn't exist"

The CLI creates it automatically. If you get an error:
```powershell
mkdir output
node dist/cli.js "niche" --out ./output
```

### "Strange characters in output"

This shouldn't happen. If you see `{{` or `}}` tokens, it's a bug. Report with:
```powershell
npm test
```
If tests fail, the issue is confirmed.

### Build fails with TypeScript errors

Verify you have Node.js 18+ installed:
```powershell
node --version
npm run build
```

## License

MIT — See [LICENSE](./LICENSE) file for details. **Free for personal and commercial use.**

---

## Release Notes

### v1.0.0 — Initial Stable Release (Jan 2026)

✅ **Offline passive income idea generator with:**
- 3 output categories (Gumroad, Etsy, AI Prompts)
- Deterministic seeded randomness for reproducibility
- Scoring system (ease, demand, differentiation, time-to-ship)
- Markdown + JSON dual output
- 25+ comprehensive tests
- Zero external dependencies
- Windows, macOS, Linux compatible

**Status:** Production ready. No breaking changes expected.

## Future Enhancements

Possible future additions (not in v1.0):
- Database of market research data
- Category-specific scoring adjustments
- Custom template support
- Web UI dashboard
- API endpoint

These would require external resources and violate the zero-cost constraint, so they're out of scope.

## Contributing

Contributions welcome! This is a community project. Areas for improvement:
- Additional template categories (Notion, Substack, etc.)
- Improved scoring algorithms based on market data
- Better niche detection and segmentation
- Performance optimizations

**Note:** Keep the zero-cost constraint. No external APIs or network calls.

## Support

- **GitHub Issues** — Report bugs or suggest features
- **Questions** — Check existing issues first
- **Gumroad** — Private support for paid version

---

**Built with:** Node.js, TypeScript, Vitest  
**Tested on:** Windows 10/11, macOS, Linux  
**Status:** Production ready, actively maintained  
**Last updated:** January 2026  
