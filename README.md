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

The repo has a Github action (auto-tag.yml) to automatically manage versions **and deploy to Webflow**.

### Automated Deployment

Every push to the `main` branch triggers a fully automated deployment:

1. **Version Management**: The `.version` file auto-increments by 1
2. **SRI Generation**: SHA-384 integrity hashes are generated for all scripts
3. **Git Tagging**: A new git tag is created with the version number
4. **Webflow Deployment**: Scripts are automatically registered with Webflow via API
5. **Site Publication**: The Webflow site is published with updated scripts

**To deploy new code, simply push to main:**
```bash
git push origin main
```

The GitHub Action will handle everything automatically, including:
- Updating script tags in Webflow with new version numbers
- Updating SRI integrity hashes for security
- Publishing the live site

### Initial Setup Required

To enable automated deployment, you need to configure GitHub Secrets. See [WEBFLOW_SETUP.md](WEBFLOW_SETUP.md) for complete setup instructions.

**Required secrets:**
- `WEBFLOW_API_TOKEN` - Your Webflow API token
- `WEBFLOW_SITE_ID` - Your target Webflow site ID

### How Scripts Are Served

Scripts are served via jsDelivr CDN using GitHub tags:

```
https://cdn.jsdelivr.net/gh/envoy/webflow-website@<version>/src/utils/form-handlers.js
```

The Webflow API automatically updates the custom code settings with the new version and SRI hash on each deployment.

## Subresource Integrity (SRI)

This repository includes SRI (Subresource Integrity) support to ensure that the scripts loaded on your website haven't been tampered with. SRI uses cryptographic hashes to verify that fetched resources match what you expect.

### Why Use SRI?

- **Security**: Protects against CDN compromises and man-in-the-middle attacks
- **Integrity**: Ensures the exact files you tested are what users receive
- **Best Practice**: Recommended by security standards for external resources

### Generating SRI Hashes

SRI hashes are **automatically generated** by the GitHub Action on every push to `main`. You can also generate them manually:

```bash
node generate-sri.js
```

This will:
- Generate SHA-384 hashes for all JS and CSS files in the `src/` directory
- Save hashes to `sri-hashes.json` for reference
- Output ready-to-use HTML tags with integrity attributes

### Automated SRI Updates

The deployment workflow automatically handles SRI:

1. **Generation**: SRI hashes are generated for all scripts
2. **Registration**: Scripts are registered with Webflow including integrity hashes
3. **Application**: Webflow applies the scripts with proper `integrity` and `crossorigin` attributes
4. **Publication**: The site goes live with updated, secure scripts

**Example of what gets deployed:**
```html
<script defer src="https://cdn.jsdelivr.net/gh/envoy/webflow-website@59/src/utils/form-handlers.js" integrity="sha384-6Vy4eUTu94zY4tZ9vzvA+yoBBwm25j9QS0YO37GtFp51R5bxvHQdpC9jkr6l5r4D" crossorigin="anonymous"></script>
```

### Important Notes

- **Fully Automated**: No manual updates needed in Webflow
- **Version-specific**: SRI hashes are tied to specific file versions
- **Security**: Every deployment includes updated integrity hashes
- **Verification**: Check `sri-hashes.json` after each push to see current hashes
