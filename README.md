# envoy.com Webflow Website Scripts

> :warning: **this repo is public**: Do not include any sensitive code here.

## Intro

For hosting public scripts used on envoy.com webflow website

These scripts are used for various purposes including but not limited to:

- Handling what happens after form submissions (/utils/form-handlers.js)
- Table of contents on the blog
- Marketo CSS styles
- Calculator component on Virtual Front Desk page
- Trigger Chili Piper booking tool on events template pages

## Setup

The repo has a Github action (auto-tag.yml) to automatically manage versions.

Versions are tracked in the .version file as an auto-incrementing integer. Each time you push code, the version will update by 1.

Every time you push to the main branch, the Github action creates a tag.

With the tag, you can create new releases and use jsdelivr to serve the scripts.

for example, to use the form-handlers.js script you can use the following URL:

```
https://cdn.jsdelivr.net/gh/envoy/webflow-website@<tag>/src/utils/form-handlers.js
```

In Webflow site-wide custom code settings, you'll see this:

```
<script defer src='https://cdn.jsdelivr.net/gh/envoy/webflow-website@30/src/utils/form-handlers.js' type="text/javascript"></script>
```

It's a minimal approach to version control and serving scripts to the website.

## Subresource Integrity (SRI)

This repository includes SRI (Subresource Integrity) support to ensure that the scripts loaded on your website haven't been tampered with. SRI uses cryptographic hashes to verify that fetched resources match what you expect.

### Why Use SRI?

- **Security**: Protects against CDN compromises and man-in-the-middle attacks
- **Integrity**: Ensures the exact files you tested are what users receive
- **Best Practice**: Recommended by security standards for external resources

### Generating SRI Hashes

To generate SRI hashes for all scripts and styles:

```bash
node generate-sri.js
```

This will:
- Generate SHA-384 hashes for all JS and CSS files in the `src/` directory
- Save hashes to `sri-hashes.json` for reference
- Output ready-to-use HTML tags with integrity attributes

### Using SRI in Webflow

In your Webflow site-wide custom code settings, update your script tags to include the `integrity` and `crossorigin` attributes:

**Before (without SRI):**
```html
<script defer src='https://cdn.jsdelivr.net/gh/envoy/webflow-website@30/src/utils/form-handlers.js' type="text/javascript"></script>
```

**After (with SRI):**
```html
<script defer src="https://cdn.jsdelivr.net/gh/envoy/webflow-website@59/src/utils/form-handlers.js" integrity="sha384-6Vy4eUTu94zY4tZ9vzvA+yoBBwm25j9QS0YO37GtFp51R5bxvHQdpC9jkr6l5r4D" crossorigin="anonymous"></script>
```

### Important Notes

- **Version-specific**: SRI hashes are tied to specific file versions. When you update a script, you must regenerate the SRI hash
- **GitHub Actions**: SRI hashes are automatically generated on each push and saved to `sri-hashes.json`
- **Update Webflow**: After updating to a new version, update both the version number AND the integrity hash in Webflow custom code
- **crossorigin attribute**: Required when using SRI with external resources

### Finding SRI Hashes

1. Check the `sri-hashes.json` file in the repository for all current hashes
2. Run `node generate-sri.js` locally to generate hashes for the current version
3. Check the GitHub Actions artifacts after each push for the updated hashes
