#!/usr/bin/env node

import { parseArgs } from "util";
import { generateContent, exportTemplates } from "./generator.js";
import { writeOutputFiles } from "./writer.js";

const options = {
  out: {
    type: "string" as const,
    short: "o",
    description: "Output directory for generated files"
  },
  seed: {
    type: "string" as const,
    description: "Seed for deterministic generation (default: random)"
  },
  count: {
    type: "string" as const,
    description: "Number of ideas to generate per category (default: 10)"
  },
  templates: {
    type: "boolean" as const,
    description: "Export internal templates to JSON file"
  },
  help: {
    type: "boolean" as const,
    short: "h",
    description: "Show help message"
  },
  version: {
    type: "boolean" as const,
    short: "v",
    description: "Show version"
  }
};

async function main() {
  try {
    const { values, positionals } = parseArgs({
      options,
      allowPositionals: true
    });

    // Show help
    if (values.help) {
      showHelp();
      process.exit(0);
    }

    // Show version
    if (values.version) {
      console.log("passive-gen 1.0.0");
      process.exit(0);
    }

    // Export templates
    if (values.templates) {
      const outputFile = typeof values.templates === "string" ? values.templates : "templates.json";
      await exportTemplates(outputFile);
      console.log(`✅ Templates exported to ${outputFile}`);
      process.exit(0);
    }

    // Validate niche argument
    const niche = positionals[0];
    if (!niche) {
      console.error("Error: NICHE argument is required");
      console.error("Usage: passive-gen <NICHE> --out <OUTPUT_DIR> [--seed <SEED>] [--count <COUNT>]");
      process.exit(1);
    }

    // Validate output directory
    const outputDir = values.out;
    if (!outputDir) {
      console.error("Error: --out option is required");
      console.error("Usage: passive-gen <NICHE> --out <OUTPUT_DIR> [--seed <SEED>] [--count <COUNT>]");
      process.exit(1);
    }

    // Determine seed (use provided or generate random)
    const seed = values.seed ? parseInt(values.seed as string, 10) : Math.floor(Math.random() * 1000000);

    // Determine count (default 10)
    const count = values.count ? parseInt(values.count as string, 10) : 10;
    if (isNaN(count) || count < 1) {
      console.error("Error: --count must be a positive number");
      process.exit(1);
    }

    console.log(`🚀 Generating passive income ideas for niche: "${niche}"`);
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`🎲 Using seed: ${seed}`);
    console.log(`📊 Generating ${count} ideas per category\n`);

    // Generate content
    const content = generateContent(niche, seed, count);

    // Write files
    await writeOutputFiles(content, outputDir);

    console.log("✅ Generation complete!");
    console.log(`📄 Generated files:`);
    console.log(`  - gumroad_ideas.md (${content.gumroadIdeas.length} ideas)`);
    console.log(`  - etsy_ideas.md (${content.etsyIdeas.length} ideas)`);
    console.log(`  - prompts.md (${content.prompts.length} prompts)`);
    console.log(`  - bundle.json (full data export)`);
    console.log(`  - README.md (overview and tips)`);
    console.log(`\n🎯 To regenerate with same results: passive-gen "${niche}" --out ${outputDir} --seed ${seed} --count ${count}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
passive-gen - Generate passive income product ideas and AI prompts for any niche

USAGE:
  npx passive-gen <NICHE> --out <OUTPUT_DIR> [--seed <SEED>]

ARGUMENTS:
  <NICHE>              The niche/topic to generate ideas for (e.g., "digital marketing")

OPTIONS:
  --out, -o <DIR>      Output directory for generated files (required)
  --seed <NUMBER>      Seed for deterministic generation (optional, uses random if omitted)
  --help, -h           Show this help message
  --version, -v        Show version

EXAMPLES:
  npx passive-gen "digital marketing" --out ./output
  npx passive-gen "dog training" --out ./ideas --seed 42
  npx passive-gen "freelance writing" --out ./gen

GENERATED FILES:
  - gumroad_ideas.md   Digital product ideas
  - etsy_ideas.md      Physical/POD product ideas with scoring
  - prompts.md         AI prompts for content creation
  - bundle.json        Complete JSON export
  - README.md          Summary and tips
`);
}

main();
