# QUICK START — Passive Income Idea Generator

**Windows PowerShell Edition**

This guide gets you generating ideas in 5 minutes. No accounts. No keys. No internet required.

---

## What You Need

✅ **Windows 10/11** (or macOS/Linux)  
✅ **Node.js 18+** (free download)  
✅ **5 minutes**  

That's it. No credit cards. No accounts. No configuration.

---

## Step 1: Install Node.js (1 minute)

1. Go to **https://nodejs.org**
2. Click **"LTS"** (Long Term Support)
3. Run the installer, accept defaults, finish
4. Verify installation:

```powershell
node --version
npm --version
```

Both commands should show version numbers. You're good.

---

## Step 2: Get the Generator (1 minute)

Choose one:

### Option A: Download ZIP (Easiest)
1. Download `passive-gen-v1.0.0.zip` from Gumroad
2. Extract to your desktop or Documents folder
3. Open PowerShell in that folder
4. Skip to Step 3

### Option B: Clone from GitHub (Free)
```powershell
git clone https://github.com/yourusername/passive-gen.git
cd passive-gen
```

---

## Step 3: Build (1 minute)

```powershell
npm install
npm run build
```

Wait for the commands to finish. You'll see a `dist/` folder appear.

---

## Step 4: Generate Ideas (1 minute)

```powershell
node dist/cli.js "your niche here" --out ./ideas
```

**Replace "your niche here" with your actual niche.** Examples:

```powershell
# Digital marketing
node dist/cli.js "digital marketing" --out ./ideas

# Dog training
node dist/cli.js "dog training" --out ./ideas

# Sustainability consulting
node dist/cli.js "sustainability consulting" --out ./ideas
```

Press **Enter**. The tool generates ideas in seconds.

---

## Step 5: View Your Ideas (30 seconds)

Open the `ideas/` folder on your computer. You'll see:

- **gumroad_ideas.md** — Course ideas with pricing guides
- **etsy_ideas.md** — Product ideas for e-commerce
- **prompts.md** — AI prompts for ChatGPT/Claude
- **bundle.json** — All data in JSON format
- **README.md** — Market analysis and tips

Open `.md` files in any text editor (Notepad, VS Code, Notepad++, etc.).

---

## Pro Tips

### Tip 1: Get the Same Results Again

Use the `--seed` flag:

```powershell
node dist/cli.js "digital marketing" --out ./ideas --seed 42
```

Run the same command 100 times → **Identical results every time.** Perfect for sharing workflows.

### Tip 2: Generate More Ideas

Change `--count`:

```powershell
node dist/cli.js "your niche" --out ./ideas --count 20
```

Max 100 ideas per category. Default is 10.

### Tip 3: Troubleshoot

**"node: command not found"** → Restart PowerShell after installing Node.js

**"dist folder missing"** → Run `npm run build` again

**"Output directory error"** → Create folder first: `mkdir ideas`

---

## What Happens Next?

1. ✅ Review the generated ideas
2. ✅ Pick your 2-3 favorites
3. ✅ Validate demand (search Google, YouTube, Reddit)
4. ✅ Build it (course, product, or prompts)
5. ✅ Sell it (Gumroad, Etsy, Notion, etc.)

---

## 100% Offline. Always.

- ✅ No internet calls
- ✅ No API keys
- ✅ No accounts
- ✅ No tracking
- ✅ No ads

Everything runs **on your computer, locally**. Your niche data never leaves your machine.

---

## Advanced Usage

### Run Tests

```powershell
npm test
```

Verifies generator is working correctly. 24 tests should pass.

### Watch Mode

```powershell
npm run dev "your niche" --out ./ideas
```

Runs without needing a build step (for development).

### View Help

```powershell
node dist/cli.js --help
```

---

## FAQ

**Q: Can I use this commercially?**  
A: Yes. MIT license. Build whatever you want. Free.

**Q: Can I redistribute this?**  
A: Use it yourself. Don't resell the package. See LICENSE.

**Q: What if I find a bug?**  
A: Report on GitHub Issues or Gumroad support.

**Q: Will it ever connect to the internet?**  
A: No. We promise. Check the code—it's all open-source.

---

## Next Steps

1. Try 3 different niches
2. Compare results
3. Pick the most interesting ideas
4. Validate with potential customers
5. Ship it

---

**Made for indie hackers, solopreneurs, and makers.**

Need help? Contact support on Gumroad.

Good luck! 🚀
