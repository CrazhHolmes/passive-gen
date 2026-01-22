import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { GeneratedContent } from "./generator.js";

/**
 * File writer for generated content
 */
export async function writeOutputFiles(
  content: GeneratedContent,
  outputDir: string
): Promise<void> {
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Generate markdown files
  const gumroadMd = formatGumroadIdeas(content);
  const etsyMd = formatEtsyIdeas(content);
  const promptsMd = formatPrompts(content);
  const bundleJson = JSON.stringify(content, null, 2);
  const readmeMd = formatReadme(content);

  // Write all files in parallel
  await Promise.all([
    writeFile(join(outputDir, "gumroad_ideas.md"), gumroadMd),
    writeFile(join(outputDir, "etsy_ideas.md"), etsyMd),
    writeFile(join(outputDir, "prompts.md"), promptsMd),
    writeFile(join(outputDir, "bundle.json"), bundleJson),
    writeFile(join(outputDir, "README.md"), readmeMd)
  ]);
}

function formatGumroadIdeas(content: GeneratedContent): string {
  const ideas = content.gumroadIdeas
    .map((idea, i) => `
## ${i + 1}. ${idea.title}

**Scores:** Ease: ${idea.scores.ease}/10 | Demand: ${idea.scores.demand}/10 | Differentiation: ${idea.scores.differentiation}/10 | Time-to-Ship: ${idea.scores.timeToShip}/10

**Why it will sell:** ${idea.whyItWillSell}

**What's included:** ${idea.whatIsIncluded}

**Who it's for:** ${idea.whoIsItFor}
`)
    .join("\n");

  return `# Gumroad Product Ideas for "${content.niche}"

Generated with seed: ${content.seed} | Total ideas: ${content.count}

## Quick Reference

| # | Idea | Ease | Demand | Diff | Speed |
|---|------|------|--------|------|-------|
${content.gumroadIdeas.map((idea, i) => `| ${i + 1} | ${idea.title} | ${idea.scores.ease} | ${idea.scores.demand} | ${idea.scores.differentiation} | ${idea.scores.timeToShip} |`).join("\n")}

## Detailed Ideas

${ideas}

## Tips for Gumroad Success

- **Price Range**: $9-$49 for courses, $5-$27 for templates and guides
- **Packaging**: Bundle your best work to increase perceived value
- **Marketing**: Share free previews on Twitter, Reddit, and relevant communities
- **Email**: Build an email list for repeat customers and product launches
- **Product Pages**: Write compelling descriptions focusing on results, not features

## Understanding the Scores

- **Ease (1-10)**: How much effort to create and launch. 10 = minimal effort (templates), 1 = maximum (custom plugins)
- **Demand (1-10)**: How much customers want this type of product. Based on market research and competition
- **Differentiation (1-10)**: How unique your offering is compared to competitors
- **Time-to-Ship (1-10)**: How quickly you can launch. 10 = days, 1 = months of development
`;
}

function formatEtsyIdeas(content: GeneratedContent): string {
  const ideas = content.etsyIdeas
    .map((idea, i) => `
## ${i + 1}. ${idea.title}

**Scores:** Ease: ${idea.scores.ease}/10 | Demand: ${idea.scores.demand}/10 | Differentiation: ${idea.scores.differentiation}/10 | Time-to-Ship: ${idea.scores.timeToShip}/10

**Why it will sell:** ${idea.whyItWillSell}

**What's included:** ${idea.whatIsIncluded}

**Who it's for:** ${idea.whoIsItFor}
`)
    .join("\n");

  return `# Etsy Product Ideas for "${content.niche}"

Generated with seed: ${content.seed} | Total ideas: ${content.count}

## Quick Reference

| # | Idea | Ease | Demand | Diff | Speed |
|---|------|------|--------|------|-------|
${content.etsyIdeas.map((idea, i) => `| ${i + 1} | ${idea.title} | ${idea.scores.ease} | ${idea.scores.demand} | ${idea.scores.differentiation} | ${idea.scores.timeToShip} |`).join("\n")}

## Detailed Ideas

${ideas}

## Tips for Etsy Success

- **Print-on-Demand**: Use services like Printful, Merch by Amazon, or Printable to avoid inventory
- **Pricing Strategy**: Mark up 3-4x your production cost
- **Tags & SEO**: Use all 13 tag slots with relevant keywords for discoverability
- **Shipping**: Offer digital downloads where possible for instant delivery and margin
- **Reviews**: Excellent customer service builds repeat customers and trust
- **Trends**: Monitor Etsy's trending searches for seasonal opportunities

## Understanding the Scores

- **Ease (1-10)**: How much design/production effort. 10 = simple print-on-demand, 1 = hand-crafted custom items
- **Demand (1-10)**: Buyer enthusiasm for this product category
- **Differentiation (1-10)**: How unique your designs/approach is
- **Time-to-Ship (1-10)**: How fast you can turn around orders. 10 = instant digital, 1 = hand-made
`;
}

function formatPrompts(content: GeneratedContent): string {
  const prompts = content.prompts
    .map((prompt, i) => `\n### Prompt ${i + 1}\n\n${prompt}`)
    .join("\n");

  return `# AI Prompts for "${content.niche}"

Generated with seed: ${content.seed} | Total prompts: ${content.count}

These prompts are optimized for Claude, ChatGPT, and Google AI Studio.

${prompts}

## How to Use These Prompts

1. **Direct Copy-Paste**: Use these prompts as-is or modify them slightly for your needs
2. **Iterate**: Ask follow-up questions to refine outputs
3. **Combine**: Merge multiple prompts to create comprehensive guides
4. **Personalize**: Replace [specific audience] with real target demographics
5. **Batch Processing**: Use with API access to generate content at scale
6. **Variations**: Change wording to adapt for different AI models

## Pro Tips

- Claude is excellent for in-depth analysis and long-form content
- ChatGPT is fast and great for brainstorming and lists
- Google AI Studio is good for creative/conversational outputs
- Always fact-check generated content, especially claims about the {niche} industry
`;
}

function formatReadme(content: GeneratedContent): string {
  const avgEase = Math.round(
    content.gumroadIdeas.reduce((sum, idea) => sum + idea.scores.ease, 0) / content.gumroadIdeas.length
  );
  const avgDemand = Math.round(
    content.gumroadIdeas.reduce((sum, idea) => sum + idea.scores.demand, 0) / content.gumroadIdeas.length
  );

  return `# Generated Content for Niche: "${content.niche}"

Generated on: ${content.generatedAt}
Seed: ${content.seed}
Count: ${content.count} ideas per category

## Files

- **gumroad_ideas.md** - ${content.gumroadIdeas.length} digital product ideas with scoring
- **etsy_ideas.md** - ${content.etsyIdeas.length} physical/POD product ideas with scoring
- **prompts.md** - ${content.prompts.length} AI prompts tailored to your niche
- **bundle.json** - Complete data export in JSON format for programmatic use

## Quick Summary

### Gumroad Ideas (Digital Products)
Average Ease: ${avgEase}/10 | Average Demand: ${avgDemand}/10

${content.gumroadIdeas.slice(0, 5).map((idea) => `- ${idea.title}`).join("\n")}
${content.gumroadIdeas.length > 5 ? `- ... and ${content.gumroadIdeas.length - 5} more` : ""}

### Etsy Ideas (Physical/Print-on-Demand)
${content.etsyIdeas.slice(0, 5).map((idea) => `- ${idea.title}`).join("\n")}
${content.etsyIdeas.length > 5 ? `- ... and ${content.etsyIdeas.length - 5} more` : ""}

### AI Prompts
${content.prompts.slice(0, 3).map((prompt) => `- ${prompt.substring(0, 70)}...`).join("\n")}
_See prompts.md for full prompt text._

## How to Use This Report

### Step 1: Review & Sort
Sort ideas by your preferred combination of scores:
- **Quick wins**: High Ease + High Time-to-Ship (launch in days)
- **Evergreen**: High Demand + High Differentiation (sustainable business)
- **Ambitious**: Lower Ease but High Demand (longer build, bigger payoff)

### Step 2: Validate
For your top 3-5 ideas:
1. Search "{niche} on Gumroad" / "{niche} on Etsy"
2. Check competitor pricing and reviews
3. Validate demand using Google Trends, Keyword Tool, Reddit searches
4. Estimate your production time and costs

### Step 3: Create & Launch
1. Start with 1-2 ideas that excite you most
2. Use the AI prompts to generate marketing copy and content
3. Create a landing page or product listing
4. Share with 10-20 trusted connections for feedback
5. Iterate based on feedback before major launch

### Step 4: Scale
Once one product works:
1. Refine and improve based on customer feedback
2. Launch 2-3 more ideas from this list
3. Build an email list for product launches
4. Create bundle/package deals to increase revenue per customer

## About the Scores

Each idea is rated on four dimensions (1-10 scale):

| Metric | Low | High | Examples |
|--------|-----|------|----------|
| **Ease** | Requires custom coding | Downloadable template | 1 = AI plugin, 10 = Google Sheet template |
| **Demand** | Niche/specialized | Wide audience interest | 1 = ultra-niche, 10 = broad appeal |
| **Differentiation** | Common/saturated market | Unique positioning | 1 = oversaturated, 10 = novel approach |
| **Time-to-Ship** | Many months | Days to weeks | 1 = 6-month build, 10 = available today |

## Reproducibility

To regenerate the exact same content, use:
\`\`\`bash
npx passive-gen "${content.niche}" --out ./out --seed ${content.seed} --count ${content.count}
\`\`\`

This ensures you get identical results for A/B testing, team discussions, or sharing specific ideas.

## Next Steps

1. ✅ Review all ideas above
2. ⭐ Star your top 3 in each category
3. 🔍 Validate 1-2 ideas with market research
4. 📝 Sketch out a launch plan for your top pick
5. 🚀 Start creating! Pick the quickest win first

---

Generated by **passive-gen** v1.0.0 | Free tool for ethical passive income ideation
`;
}
