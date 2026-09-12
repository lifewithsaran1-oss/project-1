# Daymark

Daymark is a quiet, ad-free new-tab dashboard. It keeps the useful bits close and leaves the noise out.

## Included

- Local clock, date, greeting, and timezone
- Search with switchable DuckDuckGo, Google, or Bing provider
- A single focus task saved in the browser
- Editable shortcut grid
- Custom name, greeting, accent color, and visibility settings
- No ads, analytics, accounts, or runtime dependencies

## Install as a Chrome or Edge new tab

1. Open the browser extensions page:
	- Chrome: `chrome://extensions`
	- Edge: `edge://extensions`
2. Turn on **Developer mode**.
3. Choose **Load unpacked**.
4. Select this project folder: `project 1`.
5. Open a new tab. Daymark will replace the default new-tab page.

The extension is defined by `manifest.json` and uses no permissions, ads, analytics, or background service.

## Run it as a normal page

Open `index.html` directly in a browser, or serve this folder with any static file server. All preferences are stored in `localStorage` and stay in the current browser.
