// ============================================================
// 06 — ADVANCED: Named Groups, Backreferences, Unicode, Pitfalls
// Run: node 06_advanced.js
// ============================================================


// ============================================================
// NAMED CAPTURING GROUPS — (?<name>...)
// ============================================================
console.log('=== NAMED CAPTURING GROUPS ===\n');

// Instead of m[1], m[2] ... use descriptive names via m.groups.name
const LOG_LINE = /^(?<date>\d{4}-\d{2}-\d{2}) (?<time>\d{2}:\d{2}:\d{2}) (?<level>INFO|WARN|ERROR) (?<message>.+)$/;

const logLine = '2024-03-15 14:32:01 ERROR Connection refused to 192.168.1.1:5432';
const m = logLine.match(LOG_LINE);
if (m?.groups) {
  const { date, time, level, message } = m.groups;
  console.log('Parsed log line:');
  console.log(`  date:    "${date}"`);
  console.log(`  time:    "${time}"`);
  console.log(`  level:   "${level}"`);
  console.log(`  message: "${message}"`);
  console.log();
}

// Named groups in replace — use $<name>
const isoDate = '2024-03-15';
const usDate = isoDate.replace(
  /(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/,
  '$<m>/$<d>/$<y>'
);
console.log('Named group replace:', isoDate, '→', usDate);
console.log();

// Named groups in matchAll
const events = '2024-01-01 DEPLOY\n2024-01-05 ROLLBACK\n2024-02-01 DEPLOY';
console.log('All events:');
for (const em of events.matchAll(/(?<date>\d{4}-\d{2}-\d{2}) (?<event>\w+)/g)) {
  console.log(`  ${em.groups.date}:  ${em.groups.event}`);
}
console.log();


// ============================================================
// BACKREFERENCES — \1, \2, (?<name>\k<name>)
// ============================================================
console.log('=== BACKREFERENCES ===\n');

// \1 refers back to what group 1 actually matched (not the pattern)
// Useful for finding repeated words or matching paired delimiters

// Find doubled words
const doubled = /\b(\w+)\s+\1\b/gi;
const text = 'the the quick brown fox fox jumped over the lazy dog';
console.log('Find doubled words in:', `"${text}"`);
for (const dm of text.matchAll(doubled)) {
  console.log(`  found repeated word: "${dm[1]}" at index ${dm.index}`);
}
console.log();

// Match paired quotes: either '' or ""
const QUOTED = /(['"])(.*?)\1/g;
const withQuotes = `She said "hello" and he replied 'goodbye'`;
console.log('Extract quoted strings from:', `"${withQuotes}"`);
for (const qm of withQuotes.matchAll(QUOTED)) {
  console.log(`  quote with ${qm[1] === '"' ? 'double' : 'single'} quotes: "${qm[2]}"`);
}
console.log();

// Named backreferences — \k<name>
const NAMED_DOUBLED = /\b(?<word>\w+)\s+\k<word>\b/gi;
console.log('Named backreference — doubled words:');
for (const ndm of text.matchAll(NAMED_DOUBLED)) {
  console.log(`  "${ndm.groups.word}"`);
}
console.log();

// Match opening/closing XML-like tags
const XML_TAG = /<(?<tag>[a-z]+)>(?<content>.*?)<\/\k<tag>>/gi;
const xml = '<div>hello</div> <span>world</span> <b>bold</b>';
console.log('Match balanced XML tags:');
for (const xm of xml.matchAll(XML_TAG)) {
  console.log(`  <${xm.groups.tag}>: "${xm.groups.content}"`);
}
console.log();


// ============================================================
// GREEDY vs LAZY vs POSSESSIVE-STYLE
// ============================================================
console.log('=== GREEDY vs LAZY: deeper look ===\n');

// The problem: greedy quantifiers grab too much
const data = '"item1", "item2", "item3"';

console.log('Extracting quoted values:');
console.log('  greedy ".*"  :', data.match(/".*"/)?.[0]);   // grabs everything from first to last quote
console.log('  lazy   ".*?" :', [...data.matchAll(/".*?"/g)].map(x => x[0]));  // each item
console.log('  class  "[^"]+":', [...data.matchAll(/"[^"]+"/g)].map(x => x[0])); // same, but explicit
// "[^"]+" is often better than ".*?" — it communicates intent and avoids backtracking
console.log();

// Catastrophic backtracking — what to avoid
// Pattern: (a+)+ on "aaaaaaaaaaaab" will hang the engine
// Avoid nested quantifiers on overlapping patterns
console.log('Catastrophic backtracking example (DON\'T DO THIS):');
console.log('  /^(a+)+$/ on "aaaaab" would cause exponential backtracking');
console.log('  Fix: use /^a+$/ or /^a{1,}$/ — no nested quantifiers');
console.log();


// ============================================================
// UNICODE & PROPERTY ESCAPES
// ============================================================
console.log('=== UNICODE ===\n');

// \p{Property} requires u flag
// Common property escapes:
// \p{L} or \p{Letter}    — any unicode letter
// \p{N} or \p{Number}    — any unicode number
// \p{P} or \p{Punctuation} — unicode punctuation
// \p{S} or \p{Symbol}    — unicode symbol (includes emoji)
// \p{Z} or \p{Separator} — unicode separator
// \p{Script=Latin}       — latin script
// \p{Emoji}              — emoji

const samples = [
  'Hello, 世界!',
  'café résumé naïve',
  '123 ١٢٣ ৪৫৬',   // Arabic-Indic and Bengali digits
  '😀 🎉 ❤️',
];

samples.forEach(s => {
  const letters  = s.match(/\p{L}+/gu) ?? [];
  const numbers  = s.match(/\p{N}+/gu) ?? [];
  const symbols  = s.match(/\p{S}/gu) ?? [];
  console.log(`Input: "${s}"`);
  console.log(`  letters:  ${JSON.stringify(letters)}`);
  console.log(`  numbers:  ${JSON.stringify(numbers)}`);
  console.log(`  symbols:  ${JSON.stringify(symbols)}`);
  console.log();
});

// Match emoji sequences (basic)
const emojiText = 'I 😀 love 🎉 regex ❤️';
console.log('Extract emoji:');
console.log(' ', emojiText.match(/\p{Emoji_Presentation}/gu));
console.log();


// ============================================================
// BUILDING REGEX DYNAMICALLY
// ============================================================
console.log('=== DYNAMIC REGEX CONSTRUCTION ===\n');

// Use new RegExp(string, flags) to build patterns at runtime
function makeWordSearcher(words) {
  const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return new RegExp(`\\b(${pattern})\\b`, 'gi');
}

const keywords = ['TODO', 'FIXME', 'HACK', 'XXX'];
const code = 'TODO: fix this; FIXME: broken; also hack around; XXX bad code';
const searcher = makeWordSearcher(keywords);
console.log(`Searching for: ${keywords.join(', ')}`);
console.log(`In: "${code}"`);
for (const km of code.matchAll(searcher)) {
  console.log(`  found "${km[0]}" at index ${km.index}`);
}
console.log();

// Escape user input before using in regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const userInput = 'Hello (world)?';
const safePattern = new RegExp(escapeRegex(userInput), 'i');
console.log(`Safe search for user input "${userInput}":`);
console.log('  test "say Hello (world)?  :', safePattern.test('say Hello (world)?'));
console.log('  test "say hello world"    :', safePattern.test('say hello world'));
console.log();


// ============================================================
// USEFUL TECHNIQUES
// ============================================================
console.log('=== USEFUL TECHNIQUES ===\n');

// 1. Trim whitespace
const padded = '   hello world   ';
console.log('Trim whitespace:');
console.log(`  "${padded}".replace(/^\\s+|\\s+$/g, '')  →  "${padded.replace(/^\s+|\s+$/g, '')}" `);
// (but just use .trim() in real code)
console.log();

// 2. Normalize whitespace
const messy = 'too   many    spaces\there';
console.log('Normalize whitespace:');
console.log(`  "${messy}"  →  "${messy.replace(/\s+/g, ' ').trim()}"`);
console.log();

// 3. Count matches
const sentence = 'the cat sat on the mat by the vat';
const theCount = (sentence.match(/\bthe\b/g) ?? []).length;
console.log(`Count "the" in "${sentence}":  ${theCount}`);
console.log();

// 4. Replace nth occurrence (replace only 2nd match)
function replaceNth(str, regex, replacement, n) {
  let count = 0;
  return str.replace(regex, (match) => {
    count++;
    return count === n ? replacement : match;
  });
}
console.log('Replace only 2nd "fox":');
const foxStr = 'the fox and the fox and the fox';
console.log(`  "${foxStr}"`);
console.log(`  →  "${replaceNth(foxStr, /fox/g, 'CAT', 2)}"`);
console.log();

// 5. Split but keep delimiters
const csv = 'one,two,,four';
console.log('Split preserving empty fields:');
console.log(`  "${csv}".split(',')  →  ${JSON.stringify(csv.split(','))}`);
// vs splitting on regex with lookahead to keep structure:
const parts = csv.split(/(?<=,)(?=,)|(?<=^|,)(?=,)/);
console.log(`  split empty: ${JSON.stringify(csv.split(/,/))}`);
console.log();
