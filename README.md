# Acrevia – Real Estate CRM Website

Marketing website for Acrevia, a real estate CRM. Plain HTML, CSS and JavaScript:
no framework, no build step. It includes an interactive demo workspace (deals,
properties, contacts, site visits, reports) that runs entirely in the browser.
Demo data is held in memory only and resets on reload.

## Run locally

The site must be opened through a server (double-clicking `index.html` will not
work because the scripts load as ES modules). From this folder run one of:

```bash
python -m http.server 8000     # use python3 on Mac/Linux
# or
npx serve .
```

Then open http://localhost:8000 (or the address `npx serve` prints).

To test on a phone, find your computer's local IP (`ipconfig` / `ifconfig`) and
open `http://YOUR-IP:8000` on the same Wi-Fi network.

## Project structure

| Path | Purpose |
|------|---------|
| `index.html` | Page content (all sections and pop-ups) |
| `css/base.css` | Colours, layout, sections, responsive rules |
| `css/theme.css` | Navy and gold look (overrides base.css) |
| `css/workspace.css` | Styles for the interactive demo |
| `css/native-controls.css` | Menu and switch that work without JavaScript |
| `css/utilities.css` | Small helper classes |
| `js/main.js` | Entry point |
| `js/data.js` | Settings and sample records |
| `js/site.js` | Enquiry pop-up, mobile menu, pricing calculator |
| `js/workspace.js` | The demo: six modules, search, filter, CSV export |
| `js/editor.js` | New / Edit record pop-up |

**Important:** the CSS files must stay in the order they are linked in
`index.html` (base, theme, workspace, native-controls, utilities) because each
one overrides the one before it. Do not merge or reorder them.

## Notes

- The enquiry form is intentionally a preview; it sends and stores nothing.
- Do not add frameworks, build tools or external libraries.

## Deploy (GitHub Pages)

Repo → Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder
`/ (root)` → Save. After a few minutes the site is live at
https://tanmay08-max.github.io/Acrevia/
