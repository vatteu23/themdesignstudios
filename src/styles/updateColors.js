/**
 * This script updates the CSS variables in globals.css based on the tailwind.config.js colors
 * Run using: node src/styles/updateColors.js
 */

const fs = require('fs');
const path = require('path');

// Get the tailwind config
const tailwindConfig = require('../../tailwind.config.js');
const colors = tailwindConfig.theme.extend.colors;

// Path to globals.css
const cssFilePath = path.join(__dirname, 'globals.css');

// Read the current CSS file
const cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Create the CSS variables string
const cssVars = Object.entries(colors)
  .map(([key, value]) => `  --${key}: ${value};`)
  .join('\n');

// Replace the CSS variables in the root block
const rootRegex = /:root\s*{[^}]*}/s;
const newRoot = `:root {\n${cssVars}\n  \n  --background: var(--primary);\n  --foreground: var(--text-dark);\n}`;

// Replace the root content in the CSS file
const updatedCss = cssContent.replace(rootRegex, newRoot);

// Write the changes back to the file
fs.writeFileSync(cssFilePath, updatedCss, 'utf8');

console.log('CSS variables updated successfully!'); 