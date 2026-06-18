#!/usr/bin/env node

/**
 * Deploy scripts to Webflow with SRI hashes
 * Reads sri-hashes.json and deploys all scripts to Webflow via API
 *
 * Required environment variables:
 * - WEBFLOW_API_TOKEN: Webflow API token with custom_code:read, custom_code:write, sites:write scopes
 * - WEBFLOW_SITE_ID: Target Webflow site ID
 *
 * Usage: node deploy-to-webflow.js
 */

const fs = require('fs');
const path = require('path');

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
const WEBFLOW_SITE_ID = process.env.WEBFLOW_SITE_ID;
const API_BASE_URL = 'https://api.webflow.com/v2';

// Script configuration mapping
const SCRIPT_CONFIG = {
  'src/utils/form-handlers.js': {
    displayName: 'Form Handlers',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/blog/table-of-contents.js': {
    displayName: 'Blog Table of Contents',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/utils/styles.css': {
    displayName: 'Marketo Styles',
    location: 'header',
    attributes: {}
  },
  'src/vfd/calculator.js': {
    displayName: 'VFD Calculator',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/events/events-template.js': {
    displayName: 'Events Template',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/workplace-challenges-and-solutions/interactive-graphic.js': {
    displayName: 'Interactive Graphic',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/utils/intl-phone-init.js': {
    displayName: 'International Phone Init',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  },
  'src/thanks/events.js': {
    displayName: 'Events Thank You',
    location: 'header',
    attributes: { defer: 'true', type: 'text/javascript' }
  }
};

async function makeRequest(url, method, body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`);
  }

  return data;
}

async function registerScript(scriptData, config, version) {
  console.log(`\n📝 Registering: ${config.displayName}`);

  const requestBody = {
    hostedLocation: scriptData.url,
    integrityHash: scriptData.integrity,
    version: version,
    displayName: config.displayName,
    canCopy: false
  };

  try {
    const result = await makeRequest(
      `${API_BASE_URL}/sites/${WEBFLOW_SITE_ID}/registered_scripts/hosted`,
      'POST',
      requestBody
    );

    console.log(`   ✅ Registered with ID: ${result.id}`);
    return result.id;
  } catch (error) {
    // If script already exists, it might return an error
    // We'll continue anyway as we can still apply it
    console.log(`   ⚠️  Registration response: ${error.message}`);

    // Generate ID from display name (same logic Webflow uses)
    const generatedId = config.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return generatedId;
  }
}

async function applyScriptsToSite(scriptIds, version) {
  console.log('\n🔧 Applying scripts to site...');

  const scripts = scriptIds.map(({ id, config }) => ({
    id: id,
    location: config.location,
    version: version,
    attributes: config.attributes
  }));

  const requestBody = { scripts };

  const result = await makeRequest(
    `${API_BASE_URL}/sites/${WEBFLOW_SITE_ID}/custom_code`,
    'PUT',
    requestBody
  );

  console.log(`   ✅ Applied ${scripts.length} scripts to site`);
  return result;
}

async function publishSite() {
  console.log('\n🚀 Publishing site...');

  const result = await makeRequest(
    `${API_BASE_URL}/sites/${WEBFLOW_SITE_ID}/publish`,
    'POST',
    { publishToWebflowSubdomain: true }
  );

  console.log('   ✅ Site published successfully');
  return result;
}

async function main() {
  // Validate environment variables
  if (!WEBFLOW_API_TOKEN) {
    console.error('❌ Error: WEBFLOW_API_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!WEBFLOW_SITE_ID) {
    console.error('❌ Error: WEBFLOW_SITE_ID environment variable is required');
    process.exit(1);
  }

  // Read SRI hashes
  const sriHashesPath = path.join(__dirname, 'sri-hashes.json');
  if (!fs.existsSync(sriHashesPath)) {
    console.error('❌ Error: sri-hashes.json not found. Run generate-sri.js first.');
    process.exit(1);
  }

  const sriData = JSON.parse(fs.readFileSync(sriHashesPath, 'utf-8'));
  const version = sriData.version;

  console.log('\n🌐 Webflow Deployment Script');
  console.log('=' .repeat(80));
  console.log(`Version: ${version}`);
  console.log(`Site ID: ${WEBFLOW_SITE_ID}`);
  console.log(`Scripts to deploy: ${sriData.hashes.length}`);

  // Filter scripts that have configuration
  const scriptsToRegister = sriData.hashes.filter(script =>
    SCRIPT_CONFIG[script.file]
  );

  if (scriptsToRegister.length === 0) {
    console.log('\n⚠️  No configured scripts found to deploy');
    return;
  }

  console.log(`Configured scripts: ${scriptsToRegister.length}`);

  // Step 1: Register all scripts
  console.log('\n' + '─'.repeat(80));
  console.log('STEP 1: Registering Scripts');
  console.log('─'.repeat(80));

  const registeredScripts = [];
  for (const scriptData of scriptsToRegister) {
    const config = SCRIPT_CONFIG[scriptData.file];
    const scriptId = await registerScript(scriptData, config, version);
    registeredScripts.push({ id: scriptId, config });
  }

  // Step 2: Apply scripts to site
  console.log('\n' + '─'.repeat(80));
  console.log('STEP 2: Applying Scripts to Site');
  console.log('─'.repeat(80));

  await applyScriptsToSite(registeredScripts, version);

  // Step 3: Publish site
  console.log('\n' + '─'.repeat(80));
  console.log('STEP 3: Publishing Site');
  console.log('─'.repeat(80));

  await publishSite();

  console.log('\n' + '='.repeat(80));
  console.log('✨ Deployment complete!');
  console.log('='.repeat(80));
  console.log('\nYour scripts are now live on Webflow with SRI protection.\n');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  });
}

module.exports = { registerScript, applyScriptsToSite, publishSite };
