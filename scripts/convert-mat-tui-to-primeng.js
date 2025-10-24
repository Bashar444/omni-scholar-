/**
 * 🧠 Description:
 * Scans every .html file under ./src and automatically converts
 * Angular Material (mat-*) and TaigaUI (tui-*) tags into their
 * PrimeNG equivalents.
 *
 * Usage:
 *   node scripts/convert-mat-tui-to-primeng.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = './src';

const replacements = {
  'mat-card': 'p-card',
  'mat-icon': 'span class="pi pi-ICON"',
  'mat-chip': 'p-chip',
  'mat-form-field': 'span class="p-float-label"',
  'mat-button': 'button pButton',
  'mat-flat-button': 'button pButton',
  'mat-raised-button': 'button pButton',
  'mat-stroked-button': 'button pButton p-button-outlined',
  'mat-tab-group': 'p-tabView',
  'mat-tabs': 'p-tabView',
  'mat-tab': 'p-tabPanel',
  'tui-input': 'input pInputText',
  'tui-button': 'button pButton',
  'tui-tabs': 'p-tabView',
  'tui-tab': 'p-tabPanel',
  'tui-chip': 'p-chip',
};

function getHtmlFiles(dir) {
  let files = [];
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function replaceTags(html) {
  let updated = html;

  for (const [oldTag, newTag] of Object.entries(replacements)) {
    const oldTagName = oldTag.split(' ')[0];
    const openTagRegex = new RegExp(`<${oldTagName}([^>]*)>(.*?)</${oldTagName}>`, 'gis');
    const selfClosingRegex = new RegExp(`<${oldTagName}([^>]*)/>`, 'gi');

    updated = updated.replace(openTagRegex, (match, attrs, content) => {
      if (oldTagName === 'mat-icon') {
        const iconName = content.trim() || 'question';
        return `<span class="pi pi-${iconName}"></span>`;
      }
      return `<${newTag}${attrs ? ' ' + attrs.trim() : ''}>${content}</${newTag.split(' ')[0]}>`;
    });

    updated = updated.replace(selfClosingRegex, `<${newTag} />`);
  }

  updated = updated
    .replace(/\bmat-elevation-z\d+\b/g, 'p-card')
    .replace(/\bmat-primary\b/g, 'p-button-primary')
    .replace(/\bmat-accent\b/g, 'p-button-secondary')
    .replace(/\bmat-warn\b/g, 'p-button-danger');

  return updated;
}

const htmlFiles = getHtmlFiles(projectRoot);
for (const file of htmlFiles) {
  const original = fs.readFileSync(file, 'utf8');
  const converted = replaceTags(original);
  if (converted !== original) {
    fs.writeFileSync(file, converted, 'utf8');
    console.log(`✅ Updated: ${file}`);
  }
}

console.log('\n✨ Conversion complete! All mat-* and tui-* tags replaced with PrimeNG equivalents.');
