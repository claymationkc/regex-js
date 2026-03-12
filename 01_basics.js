// ============================================================
// 01 — BASICS: Literals, Character Classes, Quantifiers, Anchors
// Run: node 01_basics.js
// ============================================================

// Helper: print match results clearly
function test(label, regex, str) {
  const match = str.match(regex);
  console.log(`${label}`);
  console.log(`  pattern: ${regex}`);
  console.log(`  input:   "${str}"`);
  console.log(`  result:  ${match ? JSON.stringify(match[0]) : 'no match'}`);
  console.log();
}

function testAll(label, regex, str) {
  const matches = [...str.matchAll(regex)].map(m => m[0]);
  console.log(`${label}`);
  console.log(`  pattern: ${regex}`);
  console.log(`  input:   "${str}"`);
  console.log(`  matches: ${JSON.stringify(matches)}`);
  console.log();
}


// ============================================================
// LITERALS — match exact characters
// ============================================================
console.log('=== LITERALS ===\n');

test('exact word match',     /cat/,   'the cat sat');
test('no match',             /dog/,   'the cat sat');
test('case sensitive',       /Cat/,   'the cat sat');  // no match
test('special chars need \\', /1\+1/, '1+1 = 2');     // escape + with \


// ============================================================
// CHARACTER CLASSES — [...]
// ============================================================
console.log('=== CHARACTER CLASSES ===\n');

// [abc]  — matches a, b, or c
testAll('vowels only',            /[aeiou]/g,    'hello world');

// [^abc] — matches anything NOT a, b, or c
testAll('non-vowels',             /[^aeiou ]/g,  'hello world');

// [a-z]  — range
testAll('lowercase letters',      /[a-z]+/g,     'Hello World 123');

// [a-zA-Z0-9] — multiple ranges
testAll('alphanumeric chunks',    /[a-zA-Z0-9]+/g, 'foo-bar_42!');

// Shorthand classes
testAll('\\d — digits',           /\d+/g,        'abc 123 def 456');
testAll('\\w — word chars',       /\w+/g,        'hello, world! 42');
testAll('\\s — whitespace',       /\s+/g,        'one  two\tthree\nfour');

// . matches any char except newline
testAll('. — any char',           /c.t/g,        'cat cot cut c t');


// ============================================================
// QUANTIFIERS — how many times
// ============================================================
console.log('=== QUANTIFIERS ===\n');

// *  — 0 or more (greedy)
test('*  zero or more',    /colou*r/,   'color');    // 0 u's
test('*  zero or more',    /colou*r/,   'colour');   // 1 u
test('*  zero or more',    /colou*r/,   'colouuur'); // 3 u's

// +  — 1 or more (greedy)
test('+  one or more',     /\d+/,       'abc 42 def');
test('+  one or more',     /\d+/,       'no digits'); // no match

// ?  — 0 or 1 (optional)
test('?  optional u',      /colou?r/,   'color');
test('?  optional u',      /colou?r/,   'colour');

// {n}   — exactly n
test('{3} exactly 3',      /\d{3}/,     '12 345 6789');   // matches 345

// {n,}  — n or more
test('{2,} 2 or more',     /\d{2,}/,    '1 22 333');      // matches 22

// {n,m} — between n and m
testAll('{2,4} 2 to 4',    /\d{2,4}/g,  '1 22 333 4444 55555');

// GREEDY vs LAZY
console.log('=== GREEDY vs LAZY ===\n');
const html = '<b>bold</b> and <i>italic</i>';

test('greedy .+  — grabs as much as possible', /<.+>/,   html);
test('lazy  .+? — grabs as little as possible', /<.+?>/,  html);
test('greedy .*',  /<.*>/,   html);
test('lazy   .*?', /<.*?>/,  html);


// ============================================================
// ANCHORS — position in string
// ============================================================
console.log('=== ANCHORS ===\n');

// ^ — start of string
test('^ start of string match',    /^hello/,  'hello world');
test('^ start — no match',         /^world/,  'hello world');

// $ — end of string
test('$ end of string match',      /world$/,  'hello world');
test('$ end — no match',           /hello$/,  'hello world');

// ^ and $ together — full string match
test('^...$ full match',           /^\d{5}$/,   '90210');    // match
test('^...$ full match fails',     /^\d{5}$/,   '9021');     // no match
test('^...$ full match fails',     /^\d{5}$/,   '902100');   // no match

// \b — word boundary
testAll('\\b word boundary',        /\bcat\b/g,  'cat concatenate cats scattered');
// only matches standalone "cat", not "cat" inside other words

// \B — NOT a word boundary
testAll('\\B non-word boundary',    /\Bcat\B/g,  'cat concatenate cats scattered');
