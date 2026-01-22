import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, rm, readFile } from "fs/promises";
import { join } from "path";
import { generateContent, exportTemplates } from "../src/generator.js";
import { writeOutputFiles } from "../src/writer.js";
import { SeededRandom } from "../src/random.js";

describe("Generator Tests", () => {
  describe("Deterministic Generation", () => {
    it("should generate identical output with same seed", () => {
      const niche = "digital marketing";
      const seed = 42;
      const count = 5;

      const result1 = generateContent(niche, seed, count);
      const result2 = generateContent(niche, seed, count);

      expect(result1.gumroadIdeas).toEqual(result2.gumroadIdeas);
      expect(result1.etsyIdeas).toEqual(result2.etsyIdeas);
      expect(result1.prompts).toEqual(result2.prompts);
    });

    it("should generate different output with different seeds", () => {
      const niche = "dog training";
      const count = 5;

      const result1 = generateContent(niche, 42, count);
      const result2 = generateContent(niche, 123, count);

      // At least one array should be different
      const isDifferent =
        !arraysEqual(result1.gumroadIdeas, result2.gumroadIdeas) ||
        !arraysEqual(result1.etsyIdeas, result2.etsyIdeas) ||
        !arraysEqual(result1.prompts, result2.prompts);

      expect(isDifferent).toBe(true);
    });

    it("should include niche in generated ideas", () => {
      const niche = "blockchain development";
      const result = generateContent(niche, 99, 5);

      result.gumroadIdeas.forEach((idea) => {
        expect(idea.title).toContain(niche);
      });

      result.etsyIdeas.forEach((idea) => {
        expect(idea.title).toContain(niche);
      });

      result.prompts.forEach((prompt) => {
        expect(prompt).toContain(niche);
      });
    });
  });

  describe("Content Generation", () => {
    it("should generate correct number of Gumroad ideas", () => {
      const result = generateContent("cloud computing", 1, 7);
      expect(result.gumroadIdeas.length).toBe(7);
      expect(result.gumroadIdeas.every((idea) => idea.title.length > 0)).toBe(true);
    });

    it("should generate correct number of Etsy ideas", () => {
      const result = generateContent("photography", 1, 10);
      expect(result.etsyIdeas.length).toBe(10);
      expect(result.etsyIdeas.every((idea) => idea.title.length > 0)).toBe(true);
    });

    it("should generate correct number of prompts", () => {
      const result = generateContent("SEO optimization", 1, 6);
      expect(result.prompts.length).toBe(6);
      expect(result.prompts.every((prompt) => prompt.length > 0)).toBe(true);
    });

    it("should include scoring information in ideas", () => {
      const result = generateContent("AI art", 555, 1);
      
      const idea = result.gumroadIdeas[0];
      expect(idea.scores.ease).toBeGreaterThanOrEqual(1);
      expect(idea.scores.ease).toBeLessThanOrEqual(10);
      expect(idea.scores.demand).toBeGreaterThanOrEqual(1);
      expect(idea.scores.demand).toBeLessThanOrEqual(10);
      expect(idea.scores.differentiation).toBeGreaterThanOrEqual(1);
      expect(idea.scores.differentiation).toBeLessThanOrEqual(10);
      expect(idea.scores.timeToShip).toBeGreaterThanOrEqual(1);
      expect(idea.scores.timeToShip).toBeLessThanOrEqual(10);
    });

    it("should include metadata fields in ideas", () => {
      const result = generateContent("fitness coaching", 1, 1);
      const idea = result.gumroadIdeas[0];

      expect(idea.title).toBeTruthy();
      expect(idea.whyItWillSell).toBeTruthy();
      expect(idea.whatIsIncluded).toBeTruthy();
      expect(idea.whoIsItFor).toBeTruthy();
    });

    it("should include overall metadata", () => {
      const niche = "AI art";
      const seed = 555;
      const count = 3;
      const result = generateContent(niche, seed, count);

      expect(result.niche).toBe(niche);
      expect(result.seed).toBe(seed);
      expect(result.count).toBe(count);
      expect(result.generatedAt).toBeTruthy();
      expect(new Date(result.generatedAt).getTime()).toBeGreaterThan(0);
    });

    it("should respect count limit (max 100)", () => {
      const result = generateContent("test", 1, 500);
      expect(result.gumroadIdeas.length).toBeLessThanOrEqual(100);
      expect(result.etsyIdeas.length).toBeLessThanOrEqual(100);
    });

    it("should handle minimum count (1)", () => {
      const result = generateContent("test", 1, 0);
      expect(result.gumroadIdeas.length).toBe(1);
      expect(result.etsyIdeas.length).toBe(1);
    });
  });

  describe("SeededRandom", () => {
    it("should produce consistent sequences with same seed", () => {
      const rng1 = new SeededRandom(42);
      const rng2 = new SeededRandom(42);

      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it("should shuffle arrays deterministically", () => {
      const arr = ["a", "b", "c", "d", "e"];

      const rng1 = new SeededRandom(42);
      const shuffled1 = rng1.shuffle(arr);

      const rng2 = new SeededRandom(42);
      const shuffled2 = rng2.shuffle(arr);

      expect(shuffled1).toEqual(shuffled2);
    });

    it("should select from array deterministically", () => {
      const arr = ["option1", "option2", "option3", "option4", "option5"];

      const rng1 = new SeededRandom(999);
      const choice1 = rng1.choice(arr);

      const rng2 = new SeededRandom(999);
      const choice2 = rng2.choice(arr);

      expect(choice1).toBe(choice2);
    });
  });
});

describe("File Writing Tests", () => {
  const testOutputDir = join(process.cwd(), ".test-output");

  beforeEach(async () => {
    await mkdir(testOutputDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testOutputDir, { recursive: true, force: true });
  });

  it("should create output directory if it doesn't exist", async () => {
    const newDir = join(testOutputDir, "nested", "deep", "dir");
    const content = generateContent("test niche", 1, 3);

    await writeOutputFiles(content, newDir);

    // If no error was thrown, the directory was created successfully
    expect(newDir).toBeTruthy();
  });

  it("should create all required output files", async () => {
    const content = generateContent("web development", 42, 3);
    await writeOutputFiles(content, testOutputDir);

    const files = [
      "gumroad_ideas.md",
      "etsy_ideas.md",
      "prompts.md",
      "bundle.json",
      "README.md"
    ];

    for (const file of files) {
      const filepath = join(testOutputDir, file);
      const data = await readFile(filepath, "utf-8");
      expect(data).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
    }
  });

  it("should include niche in all markdown files", async () => {
    const niche = "machine learning";
    const content = generateContent(niche, 1, 3);
    await writeOutputFiles(content, testOutputDir);

    const files = ["gumroad_ideas.md", "etsy_ideas.md", "prompts.md", "README.md"];

    for (const file of files) {
      const data = await readFile(join(testOutputDir, file), "utf-8");
      expect(data).toContain(niche);
    }
  });

  it("should export all data in bundle.json", async () => {
    const content = generateContent("blockchain", 77, 3);
    await writeOutputFiles(content, testOutputDir);

    const bundleData = await readFile(join(testOutputDir, "bundle.json"), "utf-8");
    const parsed = JSON.parse(bundleData);

    expect(parsed.niche).toBe("blockchain");
    expect(parsed.seed).toBe(77);
    expect(parsed.count).toBe(3);
    expect(parsed.gumroadIdeas.length).toBe(3);
    expect(parsed.etsyIdeas.length).toBe(3);
    expect(parsed.prompts.length).toBe(3);
  });

  it("should include scoring in exported JSON", async () => {
    const content = generateContent("fitness", 1, 1);
    await writeOutputFiles(content, testOutputDir);

    const bundleData = await readFile(join(testOutputDir, "bundle.json"), "utf-8");
    const parsed = JSON.parse(bundleData);

    const idea = parsed.gumroadIdeas[0];
    expect(idea.scores).toHaveProperty("ease");
    expect(idea.scores).toHaveProperty("demand");
    expect(idea.scores).toHaveProperty("differentiation");
    expect(idea.scores).toHaveProperty("timeToShip");
  });

  it("should include seed in output files for reproducibility", async () => {
    const seed = 12345;
    const content = generateContent("fitness coaching", seed, 2);
    await writeOutputFiles(content, testOutputDir);

    const gumroadData = await readFile(join(testOutputDir, "gumroad_ideas.md"), "utf-8");
    expect(gumroadData).toContain(`seed: ${seed}`);

    const bundleData = await readFile(join(testOutputDir, "bundle.json"), "utf-8");
    expect(bundleData).toContain(`"seed": ${seed}`);
  });
});

describe("Validation Tests", () => {
  it("should handle empty niche gracefully", () => {
    const result = generateContent("", 1, 1);
    expect(result.niche).toBe("");
  });

  it("should handle special characters in niche", () => {
    const niche = "AI/ML & Web3 @#$%";
    const result = generateContent(niche, 1, 1);
    expect(result.niche).toBe(niche);
  });

  it("should generate content for long niche names", () => {
    const niche =
      "sustainable urban farming practices for small business entrepreneurs in developing countries";
    const result = generateContent(niche, 1, 2);

    result.gumroadIdeas.forEach((idea) => {
      expect(idea.title).toContain(niche);
    });
  });
});

// Helper function
function arraysEqual<T extends { title?: string; [key: string]: any }>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => {
    // For complex objects, compare titles
    if (typeof val === "object" && val.title) {
      return val.title === b[idx]?.title;
    }
    return val === b[idx];
  });
}

describe("Output Validation Tests", () => {
  it("should not contain double braces {{ or }} in output", async () => {
    const content = generateContent("test niche", 1, 3);

    // Check all Gumroad ideas
    content.gumroadIdeas.forEach((idea) => {
      expect(idea.title).not.toContain("{{");
      expect(idea.title).not.toContain("}}");
      expect(idea.whyItWillSell).not.toContain("{{");
      expect(idea.whyItWillSell).not.toContain("}}");
      expect(idea.whatIsIncluded).not.toContain("{{");
      expect(idea.whatIsIncluded).not.toContain("}}");
      expect(idea.whoIsItFor).not.toContain("{{");
      expect(idea.whoIsItFor).not.toContain("}}");
    });

    // Check all Etsy ideas
    content.etsyIdeas.forEach((idea) => {
      expect(idea.title).not.toContain("{{");
      expect(idea.title).not.toContain("}}");
      expect(idea.whyItWillSell).not.toContain("{{");
      expect(idea.whyItWillSell).not.toContain("}}");
      expect(idea.whatIsIncluded).not.toContain("{{");
      expect(idea.whatIsIncluded).not.toContain("}}");
      expect(idea.whoIsItFor).not.toContain("{{");
      expect(idea.whoIsItFor).not.toContain("}}");
    });

    // Check all prompts
    content.prompts.forEach((prompt) => {
      expect(prompt).not.toContain("{{");
      expect(prompt).not.toContain("}}");
    });
  });
});
