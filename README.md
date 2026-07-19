# Shrinkroom — free image compressor

A single-purpose tool: drop in a photo, drag the quality/size dials, download a smaller file.
Everything runs in the browser (HTML5 canvas) — no server, no upload, no backend cost.

Files:
- `index.html` — page structure and copy
- `style.css` — all styling
- `script.js` — compression logic

## 1. Put it on GitHub

```bash
cd image-compressor
git init
git add .
git commit -m "Initial commit: Shrinkroom image compressor"
```

Create a new empty repo on GitHub (github.com/new — don't add a README there), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/shrinkroom.git
git branch -M main
git push -u origin main
```

## 2. Deploy on Vercel (free)

1. Go to vercel.com → sign in with GitHub.
2. Click **Add New → Project**, pick the `shrinkroom` repo.
3. Framework preset: choose **Other** (it's static HTML, no build step needed).
4. Click **Deploy**. You'll get a URL like `shrinkroom.vercel.app` within a minute.
5. Optional: add a custom domain later under Project → Settings → Domains.

Every future `git push` to `main` auto-redeploys.

## 3. Get it in front of people (this matters more than the code)

AdSense needs real traffic before it pays anything, so before/alongside applying:
- Post it where people already ask this exact question: r/webdev tool-share threads, Indie Hackers "Show IH", Product Hunt (for a small tool, a simple launch is fine).
- Write one blog post or Reddit answer targeting a specific query like "how to compress a photo under 100kb" and link to the tool — specific long-tail searches convert better than generic ones for a brand-new site.
- Add basic on-page SEO: the `<title>` and `<meta name="description">` are already set in `index.html` — edit the wording if you retarget the tool.
- Submit the URL to Google Search Console (search.google.com/search-console) so Google indexes it quickly.

## 4. Add Google AdSense

1. Apply at adsense.google.com with your live Vercel URL (a domain with real, working content — this one qualifies once deployed).
2. Approval usually takes days to a few weeks, and Google wants to see the site is genuinely useful, not empty — this one already has real functionality and an FAQ, which helps.
3. Once approved, you'll get a snippet like:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
   Paste it in `index.html` where the `<!-- ADSENSE -->` comment is, in the `<head>`.
4. Replace the two placeholder boxes (`.ad-slot--banner` and `.ad-slot--rect` divs in `index.html`) with your actual `<ins class="adsbygoogle">` ad unit code from the AdSense dashboard — sizes already match a standard 728x90 leaderboard and a 300x250/336x280 rectangle.

## Reality check on $3-4/day

At typical AdSense rates (~$1-3 per 1,000 US pageviews for a tool site, often less for other regions), $3-4/day usually needs somewhere around 2,000-5,000 pageviews/day once the site is indexed and ranking — that's the real bottleneck, not the code. Expect it to take weeks to months of consistent traffic-building (SEO, Reddit/forum answers, maybe a few tool directories) rather than happening immediately after deploy.

## Ideas for a v2 (optional, later)
- Batch mode: compress multiple photos at once, download as a zip.
- A "target file size" input instead of a quality slider, with the script searching for the quality that hits it.
- More tools on the same domain (PDF merge, text case converter) to build a small "tool site" with more pages to rank.
