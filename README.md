# Workwear Selecta

Static GitHub Pages tool for selecting eligible workwear products against a hard **5,500 NOK** allowance.

## What it does

- Shows the 68 eligible men's products from the approved spreadsheet.
- Search, collection filter, category filter and sorting.
- Adds/removes products from a live selection.
- Hard cap at 5,500 NOK.
- Products that no longer fit within the remaining allowance are dynamically disabled.
- Selected products always remain removable.
- Saves the current selection in the browser via `localStorage`.
- Copies a clean order summary to the clipboard.
- Responsive layout for desktop and mobile.

## Files

- `index.html` — page structure
- `styles.css` — UI styling
- `app.js` — selector logic
- `products.js` — product data used by the app
- `data/products.json` — same product data in JSON form
- `data/products.csv` — spreadsheet-friendly source export
- `.nojekyll` — lets GitHub Pages serve the files as-is

## Update the allowance

Change this line near the top of `app.js`:

```js
const ALLOWANCE = 5500;
```

## Update products

The running app reads `products.js`. Keep each product in this shape:

```js
{
  id: "femund-2673-26",
  collection: "Femund",
  model: "femund warm2 Jacket",
  modelNumber: "2673-26",
  category: "Fleece / Midlayer",
  price: 1999
}
```

## GitHub Pages

The simplest deployment is:

1. Put these files in the repository root.
2. Commit and push to the default branch.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the default branch and `/ (root)`.
6. Save.

No Node.js, npm, build step, framework or server is required.
