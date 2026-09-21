# workwear_selecta01

Workwear selection tool — a single-page app for picking workwear by gender, product,
colour and size, with a soundtrack.

**Live site:** https://workwear-selecta.github.io/Freddz1369/

## Running it locally

No build step and no dependencies. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Opening `index.html` directly from the file system
mostly works, but browsers restrict audio playback over `file://`, so use the server.