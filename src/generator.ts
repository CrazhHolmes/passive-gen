import { SeededRandom } from "./random.js";
import { writeFile } from "fs/promises";

/**
 * Idea with detailed metadata and scoring
 */
export interface IdeaWithScoring {
  title: string;
  whyItWillSell: string;
  whatIsIncluded: string;
  whoIsItFor: string;
  scores: {
    ease: number; // 1-10: How easy to build/launch
    demand: number; // 1-10: Market demand
    differentiation: number; // 1-10: Uniqueness
    timeToShip: number; // 1-10: How quick to launch
  };
}

/**
 * Generated content with enhanced metadata
 */
export interface GeneratedContent {
  gumroadIdeas: IdeaWithScoring[];
  etsyIdeas: IdeaWithScoring[];
  prompts: string[];
  niche: string;
  seed: number;
  count: number;
  generatedAt: string;
}

// Base templates for Gumroad (digital products)
const gumroadTemplates = [
  "Complete {niche} starter guide in PDF",
  "{niche} video course with 10+ modules",
  "{niche} Excel template and spreadsheet toolkit",
  "Daily {niche} checklist and planning system",
  "{niche} directory of 100+ resources",
  "Premium {niche} email templates",
  "{niche} brand identity kit (logos, fonts, colors)",
  "Automated {niche} pricing calculator",
  "{niche} swipe file and copywriting templates",
  "{niche} habit tracker and progress app",
  "Step-by-step {niche} implementation roadmap",
  "{niche} scripts and pitch decks",
  "Advanced {niche} case studies collection",
  "{niche} certification course materials",
  "Done-for-you {niche} content calendar",
  "{niche} tools comparison spreadsheet",
  "Interview series: {niche} experts talk",
  "{niche} podcast episode transcripts",
  "Component library for {niche} projects",
  "{niche} ROI calculator and metrics tracker",
  "Customizable {niche} Notion templates",
  "{niche} troubleshooting and FAQ database",
  "Premium {niche} stock photos and graphics",
  "{niche} automation scripts and code snippets",
  "Complete {niche} business plan templates",
  "{niche} sales pipeline and CRM setup guide",
  "Advanced {niche} metrics dashboard",
  "{niche} team training program materials",
  "Exclusive {niche} industry report and analysis",
  "Done-with-you {niche} audit checklist"
];

// Base templates for Etsy (physical/POD products)
const etsyTemplates = [
  "{niche} motivational printable wall art",
  "Personalized {niche} t-shirt design",
  "{niche} coffee mug with witty quote",
  "Custom {niche} notebook and journal",
  "{niche} enamel pin collection",
  "Premium {niche} tote bag design",
  "Engraved {niche} wooden sign",
  "{niche} sticker sheet assortment",
  "Aesthetic {niche} phone wallpaper pack",
  "Custom {niche} leather bookmark",
  "Digital {niche} planner printables",
  "{niche} throw pillow cover design",
  "Professional {niche} business cards",
  "{niche} desk mat with calendars",
  "Funny {niche} greeting cards set",
  "Premium {niche} passport holder",
  "{niche} canvas tote and accessories",
  "Printable {niche} habit tracker",
  "{niche} themed jigsaw puzzle",
  "Custom {niche} wall calendar design",
  "{niche} hoodie and apparel collection",
  "Laser-engraved {niche} gift box set",
  "{niche} mindfulness card deck",
  "Personalized {niche} mug and tumbler",
  "{niche} phone case with designs",
  "Aesthetic {niche} desk organizer",
  "{niche} limited edition poster series",
  "Custom {niche} event tickets template",
  "{niche} branded merchandise bundle",
  "Luxury {niche} packaging and labels"
];

// AI Prompt templates
const promptTemplates = [
  "Create a 30-day action plan for someone new to {niche}. Include weekly milestones and daily tasks.",
  "I'm a beginner in {niche}. What are the top 5 mistakes people make and how to avoid them?",
  "Generate 10 unique business ideas within {niche} that can be started with minimal budget.",
  "Explain {niche} concepts using simple analogies that a 10-year-old would understand.",
  "Create a comparison matrix of the best tools and software for {niche} professionals.",
  "Write a compelling pitch for a {niche} product or service that would appeal to [specific audience].",
  "What are the emerging trends in {niche} for 2024-2025? How should professionals adapt?",
  "Create a step-by-step tutorial for the most common {niche} task beginners struggle with.",
  "Generate 20 SEO-optimized blog post titles about {niche} that would rank in Google.",
  "Interview questions: What would you ask a {niche} expert to learn their best strategies?",
  "Create a {niche} content calendar for a month with specific post ideas and angles.",
  "How can someone transition their career into {niche}? What skills and education matter most?",
  "Generate a list of {niche} communities, forums, and places where professionals gather.",
  "What are the most common customer pain points in {niche}? How do solutions address them?",
  "Create a {niche} glossary of 30 essential terms every professional should know.",
  "Brainstorm 15 viral content ideas for a {niche} brand on TikTok and Instagram.",
  "What certifications and credentials matter most in {niche}? Which are worth pursuing?",
  "Design a lead magnet for a {niche} business. What would make people eager to download it?",
  "Create an email sequence to nurture leads interested in {niche} solutions.",
  "What are the best {niche} podcasts, YouTube channels, and resources to stay updated?",
  "Generate 5 case studies of successful {niche} businesses and what made them successful.",
  "Create a competitive analysis framework for {niche} products and services.",
  "What are the top pricing strategies used in the {niche} industry? How to position your offer?",
  "Design a customer journey map for a typical {niche} buyer.",
  "Generate 10 unique angles for selling {niche} products that competitors aren't using."
];

// Score patterns for different idea types
const scorePatterns: Record<string, IdeaWithScoring["scores"]> = {
  "template": { ease: 9, demand: 7, differentiation: 5, timeToShip: 10 },
  "course": { ease: 5, demand: 8, differentiation: 7, timeToShip: 4 },
  "printable": { ease: 8, demand: 6, differentiation: 4, timeToShip: 9 },
  "apparel": { ease: 7, demand: 7, differentiation: 5, timeToShip: 7 },
  "plugin": { ease: 3, demand: 9, differentiation: 8, timeToShip: 3 },
  "guide": { ease: 7, demand: 6, differentiation: 6, timeToShip: 8 },
  "toolkit": { ease: 6, demand: 8, differentiation: 7, timeToShip: 6 },
  "analytics": { ease: 4, demand: 9, differentiation: 8, timeToShip: 5 },
  "community": { ease: 4, demand: 8, differentiation: 8, timeToShip: 5 },
  "default": { ease: 6, demand: 6, differentiation: 6, timeToShip: 6 }
};

/**
 * Generate product ideas and prompts with scoring for a given niche
 */
export function generateContent(
  niche: string,
  seed: number,
  count: number = 10
): GeneratedContent {
  const rng = new SeededRandom(seed);
  
  // Limit count to reasonable range
  const finalCount = Math.min(Math.max(count, 1), 100);

  // Generate Gumroad ideas with scoring
  const gumroadIdeas = generateGumroadIdeas(niche, finalCount, rng);

  // Generate Etsy ideas with scoring
  const etsyIdeas = generateEtsyIdeas(niche, finalCount, rng);

  // Generate prompts
  const prompts = rng
    .shuffle(promptTemplates)
    .slice(0, finalCount)
    .map((template) => template.replace(/{niche}/g, niche));

  return {
    gumroadIdeas,
    etsyIdeas,
    prompts,
    niche,
    seed,
    count: finalCount,
    generatedAt: new Date().toISOString()
  };
}

function generateGumroadIdeas(
  niche: string,
  count: number,
  rng: SeededRandom
): IdeaWithScoring[] {
  const templates = rng.shuffle(gumroadTemplates).slice(0, count);
  
  return templates.map((template) => {
    const title = template.replace(/{niche}/g, niche);
    const typeKeyword = extractTypeKeyword(template);
    const baseScores = scorePatterns[typeKeyword] || scorePatterns.default;

    // Add slight randomization (±1) to scores based on niche
    const scores = {
      ease: Math.max(1, Math.min(10, baseScores.ease + rng.next() * 2 - 1)),
      demand: Math.max(1, Math.min(10, baseScores.demand + rng.next() * 2 - 1)),
      differentiation: Math.max(1, Math.min(10, baseScores.differentiation + rng.next() * 2 - 1)),
      timeToShip: Math.max(1, Math.min(10, baseScores.timeToShip + rng.next() * 2 - 1))
    };

    return {
      title,
      whyItWillSell: generateWhyItWillSell(title, niche, typeKeyword),
      whatIsIncluded: generateWhatIsIncluded(title, typeKeyword),
      whoIsItFor: generateWhoIsItFor(title, niche),
      scores: {
        ease: Math.round(scores.ease),
        demand: Math.round(scores.demand),
        differentiation: Math.round(scores.differentiation),
        timeToShip: Math.round(scores.timeToShip)
      }
    };
  });
}

function generateEtsyIdeas(
  niche: string,
  count: number,
  rng: SeededRandom
): IdeaWithScoring[] {
  const templates = rng.shuffle(etsyTemplates).slice(0, count);
  
  return templates.map((template) => {
    const title = template.replace(/{niche}/g, niche);
    const typeKeyword = extractEtsyTypeKeyword(template);
    const baseScores = scorePatterns[typeKeyword] || scorePatterns.default;

    const scores = {
      ease: Math.max(1, Math.min(10, baseScores.ease + rng.next() * 2 - 1)),
      demand: Math.max(1, Math.min(10, baseScores.demand + rng.next() * 2 - 1)),
      differentiation: Math.max(1, Math.min(10, baseScores.differentiation + rng.next() * 2 - 1)),
      timeToShip: Math.max(1, Math.min(10, baseScores.timeToShip + rng.next() * 2 - 1))
    };

    return {
      title,
      whyItWillSell: generateEtsyWhyItWillSell(title, niche),
      whatIsIncluded: generateEtsyWhatIsIncluded(title, typeKeyword),
      whoIsItFor: generateWhoIsItFor(title, niche),
      scores: {
        ease: Math.round(scores.ease),
        demand: Math.round(scores.demand),
        differentiation: Math.round(scores.differentiation),
        timeToShip: Math.round(scores.timeToShip)
      }
    };
  });
}

function extractTypeKeyword(template: string): string {
  if (template.includes("course") || template.includes("training")) return "course";
  if (template.includes("template") || template.includes("spreadsheet")) return "template";
  if (template.includes("guide") || template.includes("roadmap")) return "guide";
  if (template.includes("toolkit")) return "toolkit";
  if (template.includes("calculator") || template.includes("dashboard")) return "analytics";
  if (template.includes("plugin")) return "plugin";
  if (template.includes("community")) return "community";
  return "default";
}

function extractEtsyTypeKeyword(template: string): string {
  if (template.includes("printable")) return "printable";
  if (template.includes("t-shirt") || template.includes("apparel") || template.includes("hoodie")) return "apparel";
  if (template.includes("mug") || template.includes("tumbler")) return "apparel";
  return "default";
}

function generateWhyItWillSell(title: string, niche: string, type: string): string {
  const reasons: Record<string, string> = {
    course: `People are willing to pay $97-$297 for comprehensive courses. With video content, you can reach global audiences and update material easily.`,
    template: `Templates save customers 10+ hours. They're willing to pay $27-$97 for done-for-you frameworks that accelerate their work.`,
    guide: `Digital guides have high perceived value despite low production cost. Proven expertise in ${niche} commands premium pricing.`,
    toolkit: `Bundled resources create more value perception than individual items. Customers get comprehensive solutions they can't find elsewhere.`,
    analytics: `Data-driven professionals will pay $49-$199 for tools that save time and provide actionable insights for ${niche}.`,
    plugin: `Professional plugins have recurring revenue potential and high demand in ${niche} communities.`,
    community: `Communities create switching costs and recurring revenue. ${niche} professionals need peer support and exclusive knowledge.`,
    default: `This offers direct value to ${niche} practitioners who are willing to invest in tools that save time or increase revenue.`
  };
  return reasons[type] || reasons.default;
}

function generateEtsyWhyItWillSell(title: string, niche: string): string {
  return `${niche} enthusiasts love branded merchandise and gifts. Print-on-demand lets you test demand without inventory risk while maintaining 200-400% margins.`;
}

function generateWhatIsIncluded(title: string, type: string): string {
  const includes: Record<string, string> = {
    course: "Video lessons, worksheets, templates, community access, and lifetime updates",
    template: "Multiple customizable files, setup guide, video tutorial, and one year of free updates",
    guide: "PDF guide, checklist, case studies, resources, and email support",
    toolkit: "20+ templates, calculators, scripts, and video walkthrough",
    analytics: "Automated calculations, real-time reporting, export options, and custom alerts",
    plugin: "Installation guide, documentation, example usage, and technical support",
    community: "Private Discord/Slack, weekly calls, resource library, and peer feedback",
    printable: "High-res files (300dpi), multiple formats (PDF, PNG), source file, and resizing guide",
    apparel: "Design files, sizing guide, care instructions, and design consultation",
    default: "Complete resource with setup guide, examples, and ongoing support"
  };
  return includes[type] || includes.default;
}

function generateEtsyWhatIsIncluded(title: string, type: string): string {
  const includes: Record<string, string> = {
    printable: "Digital files (PDF + PNG), print-ready, multiple color options, and resizing guide",
    apparel: "Design files, mockups in multiple colors, sizing chart, and seller tips",
    default: "Product with packaging, care instructions, and seller optimization guide"
  };
  return includes[type] || includes.default;
}

function generateWhoIsItFor(title: string, niche: string): string {
  const audiences = [
    `${niche} professionals looking to streamline their workflow`,
    `Beginners in ${niche} who need structured guidance`,
    `Teams wanting to standardize ${niche} processes`,
    `Entrepreneurs scaling their ${niche} business`,
    `People seeking to transition into ${niche}`,
    `Existing ${niche} practitioners wanting to offer more value`
  ];
  
  // Deterministically pick based on title hash
  const hash = title.split("").reduce((h, c) => h + c.charCodeAt(0), 0);
  return audiences[hash % audiences.length];
}

/**
 * Export templates to JSON for user customization
 */
export async function exportTemplates(outputFile: string): Promise<void> {
  const templates = {
    gumroad: gumroadTemplates,
    etsy: etsyTemplates,
    prompts: promptTemplates,
    scorePatterns
  };

  const content = JSON.stringify(templates, null, 2);
  await writeFile(outputFile, content);
}
