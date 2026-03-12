// ============================================================
// 04 — FLAGS & JS REGEX METHODS
// Run: node 04_flags_and_methods.js
// ============================================================


// ============================================================
// FLAGS
// ============================================================
console.log('=== FLAGS ===\n');

const str = 'The Quick Brown Fox\nquick brown fox';

// g — global: find ALL matches instead of stopping at first
console.log('g — global flag');
console.log('  no g:', 'aabbcc'.match(/[a-c]/));          // only first match
console.log('  with g:', 'aabbcc'.match(/[a-c]/g));       // all matches
console.log();

// i — case insensitive
console.log('i — case insensitive');
console.log('  /quick/ :', str.match(/quick/));            // only lowercase "quick" on line 2
console.log('  /quick/i:', str.match(/quick/i));           // matches "Quick" on line 1
console.log();

// m — multiline: ^ and $ match start/end of each LINE
console.log('m — multiline');
const multiline = 'first line\nsecond line\nthird line';
console.log('  no m:', multiline.match(/^\w+/g));          // only matches "first"
console.log('  with m:', multiline.match(/^\w+/gm));       // matches each line start
console.log('  line endings with m:', multiline.match(/\w+$/gm)); // each line end
console.log();

// s — dotAll: . matches newline too
console.log('s — dotAll (. matches \\n)');
const multiStr = 'start\nmiddle\nend';
console.log('  no s:', multiStr.match(/start.+end/));       // no match — . won't cross newlines
console.log('  with s:', multiStr.match(/start.+end/s));    // matches
console.log();

// u — unicode: enables full unicode support, \p{} classes
console.log('u — unicode flag');
// Without u, regex treats code points > U+FFFF as two units
const emoji = '😀 hello 👋';
console.log('  emoji chars (no u):', emoji.match(/./g)?.length, 'items');   // emoji split into 2 surrogates
console.log('  emoji chars (u):', emoji.match(/./gu)?.length, 'items');     // correct count
// \p{} property escapes (requires u flag)
const mixed = 'café résumé naïve';
console.log('  \\p{L} unicode letters:', mixed.match(/\p{L}+/gu));
console.log('  \\p{Script=Latin}:', 'αβγ abc ΩΨΦ'.match(/\p{Script=Latin}+/gu));
console.log();

// d — indices flag (v8/Node 16+): adds .indices to match result
console.log('d — indices flag (adds match index ranges)');
try {
  const m = 'hello world'.match(/(\w+)\s(\w+)/d);
  console.log('  full match indices:', m?.indices?.[0]);    // [0, 11]
  console.log('  group 1 indices:',    m?.indices?.[1]);    // [0, 5]
  console.log('  group 2 indices:',    m?.indices?.[2]);    // [6, 11]
} catch (e) {
  console.log('  (d flag requires Node 16+)');
}
console.log();

// Combining flags
console.log('combining flags: gi');
console.log('  /fox/gi:', str.match(/fox/gi));   // both "Fox" and "fox"
console.log();


// ============================================================
// JS REGEX METHODS
// ============================================================
console.log('=== JS REGEX METHODS ===\n');

// ----------------------------------------------------------------
// test() — returns boolean, cheapest way to check for a match
// ----------------------------------------------------------------
console.log('--- regex.test(str) ---');
const hasDigit = /\d/.test('abc123');
console.log('  /\\d/.test("abc123"):', hasDigit);   // true
console.log('  /\\d/.test("abcdef"):', /\d/.test('abcdef'));  // false
console.log();

// ----------------------------------------------------------------
// match() — returns first match (or all with g flag)
// ----------------------------------------------------------------
console.log('--- str.match(regex) ---');
const sentence = 'I have 3 cats and 7 dogs';
console.log('  no g — first match + groups:', sentence.match(/(\d+) (\w+)/));
// Returns array: [fullMatch, group1, group2, index, input]
console.log('  with g — all full matches:', sentence.match(/\d+/g));
// With g flag: returns array of matched strings, NO groups
console.log();

// ----------------------------------------------------------------
// matchAll() — iterator of all matches INCLUDING groups
// Use this when you need groups AND multiple matches
// ----------------------------------------------------------------
console.log('--- str.matchAll(regex) ---');
const data = 'Alice:30, Bob:25, Carol:35';
for (const m of data.matchAll(/(\w+):(\d+)/g)) {
  console.log(`  name="${m[1]}" age="${m[2]}" at index ${m.index}`);
}
console.log();

// ----------------------------------------------------------------
// search() — returns index of first match, or -1
// ----------------------------------------------------------------
console.log('--- str.search(regex) ---');
console.log('  "hello world".search(/world/):', 'hello world'.search(/world/));   // 6
console.log('  "hello world".search(/xyz/):', 'hello world'.search(/xyz/));       // -1
console.log();

// ----------------------------------------------------------------
// replace() — replace first (or all with g)
// ----------------------------------------------------------------
console.log('--- str.replace(regex, replacement) ---');

// Basic replacement
console.log('  basic:', 'foo bar foo'.replace(/foo/, 'baz'));     // only first
console.log('  global:', 'foo bar foo'.replace(/foo/g, 'baz'));   // all

// Replacement strings with capture references: $1, $2, $&, $`, $'
const name = 'Smith, John';
console.log('  reorder name:', name.replace(/(\w+), (\w+)/, '$2 $1'));
// $& = whole match, $` = before match, $' = after match
console.log('  $& (whole match):', 'hello'.replace(/ell/, '[$&]'));       // h[ell]o
console.log("  $` (before match):", 'hello'.replace(/ell/, "[$`]"));      // h[h]o
console.log("  $' (after match):", 'hello'.replace(/ell/, "[$']"));       // h[o]o

// Replacement function — most powerful form
const result = 'the price is $5.00 and $12.50'.replace(
  /\$(\d+\.\d{2})/g,
  (match, amount) => `$${(parseFloat(amount) * 1.1).toFixed(2)}`  // add 10% tax
);
console.log('  fn replacement (add 10% tax):', result);
console.log();

// ----------------------------------------------------------------
// replaceAll() — replace all without needing g flag
// ----------------------------------------------------------------
console.log('--- str.replaceAll(regex, replacement) ---');
// replaceAll with regex REQUIRES the g flag (throws otherwise)
console.log('  replaceAll:', 'a.b.c'.replaceAll(/\./g, '-'));
// More commonly used with strings: 'a.b.c'.replaceAll('.', '-')
console.log();

// ----------------------------------------------------------------
// split() — split string using regex as delimiter
// ----------------------------------------------------------------
console.log('--- str.split(regex) ---');
console.log('  split on whitespace:', 'one  two\tthree\nfour'.split(/\s+/));
console.log('  split on , or ;:', 'a,b;c,d;e'.split(/[,;]/));
// Capturing group in split includes the delimiter in results
console.log('  split + capture delimiter:', 'one,two;three'.split(/([,;])/));
console.log();


// ============================================================
// STATEFUL REGEX: the lastIndex gotcha
// ============================================================
console.log('=== STATEFUL REGEX (lastIndex) ===\n');

// When you use exec() or test() on a /g regex, it remembers where it left off.
// This is useful for iterating, but can cause bugs if you reuse the same regex.

const gRegex = /\d+/g;
const testStr = 'a1 b2 c3';

console.log('exec() iteration with /g:');
let m;
while ((m = gRegex.exec(testStr)) !== null) {
  console.log(`  found "${m[0]}" at index ${m.index}, lastIndex now ${gRegex.lastIndex}`);
}
console.log();

// The bug: reusing a /g regex literal can give wrong results
const buggyRegex = /\d+/g;
console.log('Reuse bug with test():');
console.log('  1st call:', buggyRegex.test('abc123'));  // true, lastIndex = 6
console.log('  lastIndex after 1st:', buggyRegex.lastIndex);
console.log('  2nd call (same string!):', buggyRegex.test('abc123')); // false! starts at 6
console.log('  Fix: reset lastIndex to 0 before reuse, or use a new regex instance');
console.log();
