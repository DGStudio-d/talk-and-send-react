#!/usr/bin/env node

/**
 * Translation Audit Script
 * 
 * This script scans the codebase for:
 * 1. Hardcoded strings in JSX/TSX files
 * 2. Translation keys used in code
 * 3. Missing translation keys in translation files
 * 4. Unused translation keys
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '../src');
const PAGES_DIR = path.join(SRC_DIR, 'pages');
const COMPONENTS_DIR = path.join(SRC_DIR, 'components');
const LOCALES_DIR = path.join(__dirname, '../public/locales');

// Translation files
const EN_FILE = path.join(LOCALES_DIR, 'en/translation.json');
const AR_FILE = path.join(LOCALES_DIR, 'ar/translation.json');
const ES_FILE = path.join(LOCALES_DIR, 'es/translation.json');

// Patterns to detect
const T_FUNCTION_PATTERN = /t\(['"`]([^'"`]+)['"`]\)/g;
const HARDCODED_STRING_PATTERN = />([A-Z][^<>{]*[a-z][^<>{}]*)</g;
const ARABIC_STRING_PATTERN = /[\u0600-\u06FF]+/g;

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract translation keys from a file
 */
function extractTranslationKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();
  let match;

  while ((match = T_FUNCTION_PATTERN.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
}

/**
 * Find hardcoded strings in a file
 */
function findHardcodedStrings(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const strings = new Set();
  let match;

  // Find English strings
  while ((match = HARDCODED_STRING_PATTERN.exec(content)) !== null) {
    const str = match[1].trim();
    // Filter out common non-translatable strings
    if (
      str.length > 3 &&
      !str.match(/^[0-9]+$/) &&
      !str.match(/^[A-Z_]+$/) &&
      !str.includes('className') &&
      !str.includes('onClick') &&
      !str.includes('onChange')
    ) {
      strings.add(str);
    }
  }

  // Find Arabic strings
  const arabicMatches = content.match(ARABIC_STRING_PATTERN);
  if (arabicMatches) {
    arabicMatches.forEach((str) => strings.add(str));
  }

  return Array.from(strings);
}

/**
 * Load translation file
 */
function loadTranslations(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Flatten nested translation object
 */
function flattenTranslations(obj, prefix = '') {
  const keys = new Set();

  Object.keys(obj).forEach((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      flattenTranslations(obj[key], fullKey).forEach((k) => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  });

  return Array.from(keys);
}

/**
 * Main audit function
 */
function auditTranslations() {
  console.log('🔍 Starting translation audit...\n');

  // Get all TypeScript/TSX files
  const files = [
    ...getAllFiles(PAGES_DIR),
    ...getAllFiles(COMPONENTS_DIR),
  ];

  console.log(`📁 Found ${files.length} files to audit\n`);

  // Extract all translation keys used in code
  const usedKeys = new Set();
  const hardcodedStrings = new Map();

  files.forEach((file) => {
    const keys = extractTranslationKeys(file);
    keys.forEach((key) => usedKeys.add(key));

    const strings = findHardcodedStrings(file);
    if (strings.length > 0) {
      hardcodedStrings.set(file, strings);
    }
  });

  console.log(`🔑 Found ${usedKeys.size} unique translation keys in use\n`);

  // Load translation files
  const enTranslations = loadTranslations(EN_FILE);
  const arTranslations = loadTranslations(AR_FILE);
  const esTranslations = loadTranslations(ES_FILE);

  const enKeys = new Set(flattenTranslations(enTranslations));
  const arKeys = new Set(flattenTranslations(arTranslations));
  const esKeys = new Set(flattenTranslations(esTranslations));

  console.log(`📚 Translation file statistics:`);
  console.log(`   - English: ${enKeys.size} keys`);
  console.log(`   - Arabic: ${arKeys.size} keys`);
  console.log(`   - Spanish: ${esKeys.size} keys\n`);

  // Find missing keys
  const missingInEn = Array.from(usedKeys).filter((key) => !enKeys.has(key));
  const missingInAr = Array.from(usedKeys).filter((key) => !arKeys.has(key));
  const missingInEs = Array.from(usedKeys).filter((key) => !esKeys.has(key));

  // Find unused keys
  const unusedInEn = Array.from(enKeys).filter((key) => !usedKeys.has(key));

  // Report results
  console.log('📊 Audit Results:\n');

  if (missingInEn.length > 0) {
    console.log(`❌ Missing in English (${missingInEn.length}):`);
    missingInEn.forEach((key) => console.log(`   - ${key}`));
    console.log('');
  } else {
    console.log('✅ All used keys exist in English\n');
  }

  if (missingInAr.length > 0) {
    console.log(`❌ Missing in Arabic (${missingInAr.length}):`);
    missingInAr.slice(0, 20).forEach((key) => console.log(`   - ${key}`));
    if (missingInAr.length > 20) {
      console.log(`   ... and ${missingInAr.length - 20} more`);
    }
    console.log('');
  } else {
    console.log('✅ All used keys exist in Arabic\n');
  }

  if (missingInEs.length > 0) {
    console.log(`❌ Missing in Spanish (${missingInEs.length}):`);
    missingInEs.slice(0, 20).forEach((key) => console.log(`   - ${key}`));
    if (missingInEs.length > 20) {
      console.log(`   ... and ${missingInEs.length - 20} more`);
    }
    console.log('');
  } else {
    console.log('✅ All used keys exist in Spanish\n');
  }

  if (unusedInEn.length > 0) {
    console.log(`⚠️  Potentially unused keys (${unusedInEn.length}):`);
    unusedInEn.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
    if (unusedInEn.length > 10) {
      console.log(`   ... and ${unusedInEn.length - 10} more`);
    }
    console.log('');
  }

  if (hardcodedStrings.size > 0) {
    console.log(`⚠️  Files with potential hardcoded strings (${hardcodedStrings.size}):`);
    let count = 0;
    for (const [file, strings] of hardcodedStrings) {
      if (count < 5) {
        const relativePath = path.relative(SRC_DIR, file);
        console.log(`\n   ${relativePath}:`);
        strings.slice(0, 3).forEach((str) => {
          console.log(`      - "${str}"`);
        });
        if (strings.length > 3) {
          console.log(`      ... and ${strings.length - 3} more`);
        }
        count++;
      }
    }
    if (hardcodedStrings.size > 5) {
      console.log(`\n   ... and ${hardcodedStrings.size - 5} more files`);
    }
    console.log('');
  }

  // Summary
  console.log('📝 Summary:');
  console.log(`   - Total translation keys in use: ${usedKeys.size}`);
  console.log(`   - Missing in English: ${missingInEn.length}`);
  console.log(`   - Missing in Arabic: ${missingInAr.length}`);
  console.log(`   - Missing in Spanish: ${missingInEs.length}`);
  console.log(`   - Potentially unused: ${unusedInEn.length}`);
  console.log(`   - Files with hardcoded strings: ${hardcodedStrings.size}`);
  console.log('');

  // Exit code
  if (missingInEn.length > 0 || missingInAr.length > 0 || missingInEs.length > 0) {
    console.log('❌ Audit failed: Missing translation keys detected');
    process.exit(1);
  } else {
    console.log('✅ Audit passed: All translation keys are present');
    process.exit(0);
  }
}

// Run audit
auditTranslations();
