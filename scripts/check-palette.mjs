import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const theme = await readFile(path.join(root, 'src/index.css'), 'utf8');
const brandNames = ['warm-ivory', 'rice-paper', 'sky-mist', 'horizon-blue', 'mountain-teal', 'heritage-green', 'antique-gold', 'lotus-pink', 'mist-cloud'];
const brandValues = brandNames.map(name => {
  const match = theme.match(new RegExp(`--color-${name}:\\s*(#[\\da-f]{6});`, 'i'));
  if (!match) throw new Error(`Missing canonical palette token: ${name}`);
  return match[1].slice(1);
});
const brandLiteral = new RegExp(`#(?:${[...brandValues, 'D4AF37'].join('|')})(?:[\\da-f]{2})?\\b`, 'i');
const brandRgb = new RegExp(`rgba?\\(\\s*(?:${brandValues.map(value => value.match(/../g).map(channel => parseInt(channel, 16)).join('[\\s,_]+')).join('|')})(?=[\\s,/)])`, 'i');
const brandOverride = new RegExp(`--color-(?:${brandNames.join('|')}):`);
const tokenOnlyStyles = new Set([
  'src/features/home/home-classic.css',
  'src/features/landing/landing.css',
  'src/features/flashcards/vocabulary.css',
  'src/features/playground/components/map-ai/ai-workspace-ui.css',
]);
const failures = [];

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) { await scan(filename); continue; }
    if (!/\.(css|tsx|ts)$/.test(filename) || filename.endsWith('.test.ts')) continue;
    const relative = path.relative(root, filename).replaceAll('\\', '/');
    if (relative === 'src/index.css') continue;
    const lines = (await readFile(filename, 'utf8')).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (brandLiteral.test(line) || brandRgb.test(line)) failures.push(`${relative}:${index + 1} Use a shared brand token instead of a literal color.`);
      if (brandOverride.test(line)) failures.push(`${relative}:${index + 1} Define brand colors only in src/index.css.`);
      if (tokenOnlyStyles.has(relative) && /#[\da-f]{3,8}\b|\brgba?\(/i.test(line)) {
        failures.push(`${relative}:${index + 1} Use a semantic color token in this migrated stylesheet.`);
      }
    });
  }
}

await scan(path.join(root, 'src'));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Palette check passed: shared brand colors are centralized; migrated surfaces use tokens.');
}
