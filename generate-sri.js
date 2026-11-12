#!/usr/bin/env node

/**
 * Generate SRI hashes for all JavaScript and CSS files in the src directory
 * Usage: node generate-sri.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSRIHash(filePath) {
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha384').update(content).digest('base64');
  return `sha384-${hash}`;
}

function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main() {
  const srcDir = path.join(__dirname, 'src');
  const version = fs.readFileSync(path.join(__dirname, '.version'), 'utf-8').trim();

  console.log(`\n🔒 Generating SRI hashes for version ${version}\n`);
  console.log('=' .repeat(80));

  const files = findFiles(srcDir, ['.js', '.css']);
  const results = [];

  files.forEach(filePath => {
    const relativePath = path.relative(__dirname, filePath);
    const hash = generateSRIHash(filePath);
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/envoy/webflow-website@${version}/${relativePath}`;

    results.push({
      file: relativePath,
      url: jsdelivrUrl,
      integrity: hash
    });
  });

  // Sort by file path
  results.sort((a, b) => a.file.localeCompare(b.file));

  // Output as formatted text
  console.log('\n📋 SRI Hashes for Webflow Custom Code:\n');
  results.forEach(({ file, url, integrity }) => {
    const ext = path.extname(file);
    const tag = ext === '.js'
      ? `<script defer src="${url}" integrity="${integrity}" crossorigin="anonymous"></script>`
      : `<link rel="stylesheet" href="${url}" integrity="${integrity}" crossorigin="anonymous">`;

    console.log(`\n// ${file}`);
    console.log(tag);
  });

  // Save to JSON file
  const outputPath = path.join(__dirname, 'sri-hashes.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    version: version,
    generated: new Date().toISOString(),
    hashes: results
  }, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ SRI hashes saved to sri-hashes.json\n`);
}

if (require.main === module) {
  main();
}

module.exports = { generateSRIHash, findFiles };
