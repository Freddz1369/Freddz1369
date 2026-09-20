# Publishing Workwear Selecta on GitHub Pages

This repo is already laid out the way GitHub Pages expects. Once this PR is merged,
publishing is four clicks in the repo settings — no build step, no Actions workflow,
nothing to install.

These instructions are for **Freddz1369**, the repo owner. Only the owner can turn
Pages on.

---

## What is in the repo

| Path | What it is |
| --- | --- |
| `index.html` | The whole app — HTML, CSS and JavaScript in one file. This is what Pages serves at the site root. |
| `.nojekyll` | An empty marker file. It tells GitHub to publish the files exactly as they are instead of running them through Jekyll. Keep it, even though it looks useless. |
| `assets/workwear-selecta-background.png` | Background image. |
| `assets/enter-selecta-sting.mp3` | Intro sting. |
| `assets/01-workwear-selecta.mp3` | Track 1. |
| `assets/02-mz-bratt-selecta-chebbyuk.mp3` | Track 2. |
| `assets/03-chase-status-selecta-bootleg.mp3` | Track 3. |

Every asset is referenced with a **relative** path (`assets/…`), which is what makes the
site work from `https://freddz1369.github.io/workwear_selecta01/` rather than only from
a domain root.

---

## Step 1 — Merge this pull request

Open the PR, read the diff, and click **Merge pull request** → **Confirm merge**.
Everything below assumes the files are on the `main` branch.

## Step 2 — Turn on GitHub Pages

1. Go to the repo on github.com: <https://github.com/Freddz1369/workwear_selecta01>
2. Click **Settings** (the tab on the far right, next to Insights).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Under **Branch**, set the two dropdowns to **`main`** and **`/ (root)`**.
6. Click **Save**.

## Step 3 — Wait for the first build

GitHub starts a deployment as soon as you hit Save. It usually takes 30–60 seconds,
occasionally a few minutes on the very first run.

- Reload the Settings → Pages screen. When it is done, a green box appears at the top:
  **"Your site is live at …"**.
- You can also watch it under the repo's **Actions** tab — the run is called
  *pages build and deployment*.

## Step 4 — Open the site

Your URL will be:

```
https://freddz1369.github.io/workwear_selecta01/
```

Open it on a phone too — the layout is built for mobile.

---

## Updating the site later

Pages redeploys automatically on every push to `main`. Edit `index.html` (or drop new
files into `assets/`), commit to `main`, wait under a minute, then hard-reload the page.

If you prefer not to commit to `main` directly, push a branch and open a PR — the
deployment happens when it merges.

---

## If something goes wrong

**The page loads but the background or audio is missing.**
The file names in `assets/` must match `index.html` exactly, including case.
`Background.PNG` and `background.png` are different files to GitHub Pages, even though
they look the same on a Mac or Windows machine.

**You get a 404 at the URL above.**
Three things to check, in order:
1. Settings → Pages still says branch `main` and folder `/ (root)`.
2. `index.html` is at the **top level** of the repo, not inside a subfolder.
3. The deployment actually finished — look at the Actions tab for a failed run.

**The page shows a directory listing, or raw text instead of the site.**
`.nojekyll` is missing, or `index.html` got renamed. Both need to be in the repo root.

**The audio does not play until you tap something.**
That is not a bug and not fixable. Browsers block audio that starts on its own; the
first tap or click on the page unlocks it. Same on iOS and Android.

**Changes do not show up.**
Your browser cached the old version. Hard-reload: `Ctrl+Shift+R` on Windows/Linux,
`Cmd+Shift+R` on macOS. On a phone, open the URL in a private tab to check.

---

## Two things worth knowing

**The site is public.** GitHub Pages on a free account is always publicly readable, and
the URL is guessable. Anyone who finds it can see the tool and everything the page
contains. If the allowance figures, product names or supplier details in `index.html`
are internal company information, do not publish them this way — that content ships to
anyone who opens the link.

**The three music tracks are commercial recordings.** Hosting them on a public site is
redistribution, regardless of how small the audience is. That is a call for you to make,
but it is worth making deliberately rather than by accident. If you would rather not,
delete the three numbered files from `assets/` and remove the playlist block from
`index.html` — the selector itself works fine without them.
