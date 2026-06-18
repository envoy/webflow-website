# Webflow API Deployment Setup Guide

This guide explains how to set up automated deployment to Webflow using the GitHub Actions workflow.

## Overview

The automated deployment workflow:
1. Automatically increments version numbers
2. Generates SRI (Subresource Integrity) hashes for all scripts
3. Registers scripts with Webflow via API (including integrity hashes)
4. Publishes the Webflow site
5. All triggered by a simple push to the `main` branch

## Prerequisites

Before setting up automated deployment, you need:

1. A Webflow site with an active plan
2. Access to your GitHub repository settings
3. Webflow API credentials with appropriate permissions

## Step 1: Create a Webflow API Token

1. Go to your Webflow workspace settings
2. Navigate to **Integrations** > **API Access**
3. Click **Generate API Token**
4. Name it something like "GitHub Deployment Bot"
5. Select the following required scopes:
   - `sites:read`
   - `sites:write`
   - `custom_code:read`
   - `custom_code:write`
6. Click **Generate Token**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again

## Step 2: Get Your Webflow Site ID

### Option A: Using the Webflow API
1. Use your API token to call:
   ```bash
   curl -X GET "https://api.webflow.com/v2/sites" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "accept: application/json"
   ```
2. Find your site in the response and copy its `id` field

### Option B: Using the Webflow Designer
1. Open your site in the Webflow Designer
2. The site ID is in the URL: `https://webflow.com/design/{SITE_ID}`
3. Copy the alphanumeric ID

## Step 3: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   **Secret 1:**
   - Name: `WEBFLOW_API_TOKEN`
   - Value: (paste the API token from Step 1)

   **Secret 2:**
   - Name: `WEBFLOW_SITE_ID`
   - Value: (paste the site ID from Step 2)

5. Click **Add secret** for each

## Step 4: Configure Script Deployment

The `deploy-to-webflow.js` script contains a `SCRIPT_CONFIG` object that defines which scripts should be deployed and how. Review and modify this configuration based on your needs:

```javascript
const SCRIPT_CONFIG = {
  'src/utils/form-handlers.js': {
    displayName: 'Form Handlers',
    location: 'header',  // 'header' or 'footer'
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  // Add more scripts as needed
};
```

**Configuration options:**
- `displayName`: Human-readable name shown in Webflow
- `location`: Where to inject the script (`'header'` or `'footer'`)
- `attributes`: HTML attributes for the script tag (defer, async, type, etc.)

## Step 5: Test the Deployment

1. Make a small change to any file in the repository
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub
4. Watch the workflow run
5. Check your Webflow site to verify the scripts are updated

## Workflow Details

### What Happens on Push to Main

1. **Version Increment**: `.version` file increments by 1
2. **SRI Generation**: SHA-384 hashes generated for all scripts
3. **Git Operations**: Changes committed and tagged
4. **Script Registration**: Each configured script is registered with Webflow including:
   - jsDelivr CDN URL with version tag
   - SRI integrity hash
   - Version number
   - Display name
5. **Script Application**: All scripts applied to the site
6. **Site Publication**: Webflow site published with new scripts

### Manual Deployment

You can also deploy manually by running:

```bash
# Generate SRI hashes
node generate-sri.js

# Deploy to Webflow
WEBFLOW_API_TOKEN=your_token WEBFLOW_SITE_ID=your_site_id node deploy-to-webflow.js
```

## Troubleshooting

### Authentication Errors (401)

- Verify your `WEBFLOW_API_TOKEN` is correct
- Check that the token has the required scopes
- Ensure the token hasn't expired

### Site Not Found (404)

- Verify your `WEBFLOW_SITE_ID` is correct
- Check that the API token has access to this site

### Script Registration Errors

- Ensure the jsDelivr CDN URL is accessible
- Verify the SRI hash matches the file content
- Check that the version number is valid (semantic versioning)

### Rate Limiting (429)

- Webflow has rate limits on API calls
- The workflow handles most scenarios, but if you're deploying frequently, you may hit limits
- Wait a few minutes and try again

## Security Best Practices

1. **Never commit API tokens**: Always use GitHub Secrets
2. **Limit token scopes**: Only grant required permissions
3. **Rotate tokens periodically**: Update tokens every few months
4. **Monitor deployments**: Check GitHub Actions logs regularly
5. **Use SRI hashes**: Always include integrity hashes for security

## Additional Resources

- [Webflow API Documentation](https://developers.webflow.com/data/reference)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Subresource Integrity (SRI)](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [jsDelivr CDN](https://www.jsdelivr.com/documentation)

## Support

For issues related to:
- **Webflow API**: Contact Webflow support or check their developer community
- **GitHub Actions**: Check the Actions tab logs for error details
- **This workflow**: Open an issue in this repository
