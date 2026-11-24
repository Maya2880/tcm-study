#!/usr/bin/env node
/**
 * TCM PDF scanner
 * Scans configured directories for PDF files and writes last-scan.json
 * Run manually: node scanner/scan.js
 * Schedule weekly: crontab -e  →  0 9 * * 1 cd ~/tcm-study && node scanner/scan.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || '/Users/mayauner';

const GDRIVE = path.join(HOME, 'Library', 'CloudStorage', 'GoogleDrive-mayauner6@gmail.com');

const SCAN_DIRS = [
  path.join(HOME, 'Desktop', 'שיאצו'),
  path.join(HOME, 'Downloads'),
  path.join(GDRIVE, 'My Drive', 'שיאצו'),
  path.join(GDRIVE, '.shortcut-targets-by-id', '10qgg2wjq6udVs9bWe313YZ93b6Mkevja', 'שיאצו א אביב אלון א ערב'),
];

const OUTPUT = path.join(__dirname, 'last-scan.json');

const STUDY_EXTS = ['.pdf', '.docx', '.pptx', '.doc', '.pages'];
const GDRIVE_EXTS = ['.gdoc', '.gsheet', '.gslides'];

function isStudyFile(filename) {
  const lower = filename.toLowerCase();
  return STUDY_EXTS.some((ext) => lower.endsWith(ext));
}

function isGDriveFile(filename) {
  const lower = filename.toLowerCase();
  return GDRIVE_EXTS.some((ext) => lower.endsWith(ext));
}

function readGDriveFile(filePath) {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const id = raw.doc_id;
    if (!id) return null;
    const ext = path.extname(filePath).toLowerCase();
    const urlBase = ext === '.gsheet'
      ? 'https://docs.google.com/spreadsheets/d/'
      : ext === '.gslides'
        ? 'https://docs.google.com/presentation/d/'
        : 'https://docs.google.com/document/d/';
    return { docId: id, url: `${urlBase}${id}/edit` };
  } catch {
    return null;
  }
}

function isShiatsuRelated(filename) {
  const lower = filename.toLowerCase();
  const keywords = ['שיאצו', 'shiatsu', 'acupuncture', 'tcm', 'meridian', 'tsubo', 'כינה', 'אקופונקטורה', 'moxibustion', 'element', 'yin', 'yang', 'qi', 'qi-'];
  return keywords.some((k) => lower.includes(k));
}

function scanDir(dir, filterByKeyword) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return found; }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...scanDir(fullPath, filterByKeyword));
    } else if (entry.isFile() && isStudyFile(entry.name)) {
      if (!filterByKeyword || isShiatsuRelated(entry.name)) {
        const stat = fs.statSync(fullPath);
        found.push({ name: entry.name, path: fullPath, size: stat.size, modified: stat.mtime.toISOString() });
      }
    } else if (entry.isFile() && isGDriveFile(entry.name)) {
      const stat = fs.statSync(fullPath);
      const gdrive = readGDriveFile(fullPath);
      if (gdrive) {
        found.push({ name: entry.name, path: fullPath, size: stat.size, modified: stat.mtime.toISOString(), gdrive });
      }
    }
  }
  return found;
}

function tryExtractText(filePath) {
  const lower = filePath.toLowerCase();
  try {
    if (lower.endsWith('.pdf')) {
      const text = execSync(`pdftotext "${filePath}" -`, { timeout: 10000, encoding: 'utf8' });
      const trimmed = text.trim();
      if (trimmed.length < 50) return null;
      return trimmed.substring(0, 500);
    }
    // docx/doc/pages: extract via textutil (built-in on macOS)
    if (lower.endsWith('.docx') || lower.endsWith('.doc') || lower.endsWith('.pages')) {
      const text = execSync(`textutil -convert txt -stdout "${filePath}"`, { timeout: 10000, encoding: 'utf8' });
      const trimmed = text.trim();
      if (trimmed.length < 50) return null;
      return trimmed.substring(0, 500);
    }
    return null;
  } catch {
    return null;
  }
}

function run() {
  console.log('🔍 TCM PDF Scanner starting...\n');
  const results = [];

  for (const dir of SCAN_DIRS) {
    const filterByKeyword = dir.includes('Downloads');
    const label = dir.replace(HOME, '~');
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Skipping (not found): ${label}`);
      continue;
    }
    const files = scanDir(dir, filterByKeyword);
    console.log(`📂 ${label}: ${files.length} file(s) found`);
    for (const file of files) {
      if (file.gdrive) {
        results.push({ ...file, preview: null, hasText: false, type: 'gdrive' });
        console.log(`   🌐 ${file.name} → ${file.gdrive.url}`);
      } else {
        const preview = tryExtractText(file.path);
        results.push({ ...file, preview, hasText: preview !== null, type: 'local' });
        console.log(`   ${preview ? '✅' : '🖼️ '} ${file.name}`);
      }
    }
  }

  const output = {
    scannedAt: new Date().toISOString(),
    totalFiles: results.length,
    withText: results.filter((r) => r.hasText).length,
    files: results,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✨ Done. ${results.length} files saved to scanner/last-scan.json`);
}

run();
