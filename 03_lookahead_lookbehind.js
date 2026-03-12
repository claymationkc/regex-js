// ============================================================
// 03 — LOOKAHEAD & LOOKBEHIND (Lookarounds)
// Run: node 03_lookahead_lookbehind.js
// ============================================================
//
// Lookarounds match a position, NOT characters.
// The characters they "look at" are NOT consumed and NOT included
// in the match. Think of them as conditions attached to a position.
//
//   (?=X)   positive lookahead  — "followed by X"
//   (?!X)   negative lookahead  — "NOT followed by X"
//   (?<=X)  positive lookbehind — "preceded by X"
//   (?<!X)  negative lookbehind — "NOT preceded by X"
//

function show(label, regex, str) {
  const matches = [...str.matchAll(regex)].map(m => m[0]);
  console.log(`${label}`);
  console.log(`  /${regex.source}/${regex.flags}`);
  console.log(`  input:   "${str}"`);
  console.log(`  matches: ${JSON.stringify(matches)}`);
  console.log();
}

function replace(label, regex, replacement, str) {
  const result = str.replace(regex, replacement);
  console.log(`${label}`);
  console.log(`  /${regex.source}/${regex.flags}`);
  console.log(`  input:   "${str}"`);
  console.log(`  result:  "${result}"`);
  console.log();
}


// ============================================================
// POSITIVE LOOKAHEAD — (?=...)
// "match X only if followed by Y"
// ============================================================
console.log('=== POSITIVE LOOKAHEAD (?=...) ===\n');

// Match digits only if followed by "px"
show('digits followed by px',
  /\d+(?=px)/g,
  'font: 16px, margin: 8px, opacity: 0.5'
);
// Matches "16" and "8" — the "px" is not included in match

// Match a word only if followed by a colon (like finding keys in JSON/config)
show('word before colon',
  /\w+(?=:)/g,
  'name: Alice, age: 30, city: NYC'
);

// Match "foo" only if followed by "bar"
show('foo only if followed by bar',
  /foo(?=bar)/g,
  'foobar foo foobaz'
);
// Only the "foo" in "foobar" matches


// ============================================================
// NEGATIVE LOOKAHEAD — (?!...)
// "match X only if NOT followed by Y"
// ============================================================
console.log('=== NEGATIVE LOOKAHEAD (?!...) ===\n');

// Match digits NOT followed by "px"
show('digits NOT followed by px',
  /\d+(?!px)/g,
  'font: 16px, margin: 8px, count: 42'
);
// Matches "42" (and partial matches of 16 and 8 — see note below)
// Note: "16" in "16px" → the engine matches "1" then backtracks...
// Use word boundaries or careful anchoring to be precise.

// Better: match a standalone number not followed by a unit
show('number not followed by a unit (anchored)',
  /\b\d+\b(?!\s*(?:px|em|rem|%))/g,
  'size: 16px, count: 42, ratio: 1.5em, index: 7'
);

// Match "foo" NOT followed by "bar"
show('foo NOT followed by bar',
  /foo(?!bar)/g,
  'foobar foo foobaz'
);
// Matches "foo" in "foo" and "foo" in "foobaz"


// ============================================================
// POSITIVE LOOKBEHIND — (?<=...)
// "match X only if preceded by Y"
// ============================================================
console.log('=== POSITIVE LOOKBEHIND (?<=...) ===\n');

// Match digits only if preceded by "$"
show('digits preceded by $',
  /(?<=\$)\d+/g,
  'price: $42, count: 7, total: $150'
);
// Matches "42" and "150" — the "$" is not in the match

// Match a word only if preceded by "@" (like usernames)
show('username after @',
  /(?<=@)\w+/g,
  'mention @alice and @bob in the thread'
);

// Extract value after "name="
show('value after name=',
  /(?<=name=)\w+/g,
  'name=Alice age=30 city=NYC'
);


// ============================================================
// NEGATIVE LOOKBEHIND — (?<!...)
// "match X only if NOT preceded by Y"
// ============================================================
console.log('=== NEGATIVE LOOKBEHIND (?<!...) ===\n');

// Match digits NOT preceded by "$"
show('digits NOT preceded by $',
  /(?<!\$)\b\d+/g,
  'price: $42, count: 7, total: $150, index: 3'
);
// Matches "7" and "3"

// Match "bar" not preceded by "foo"
show('bar not preceded by foo',
  /(?<!foo)bar/g,
  'foobar crowbar handlebar'
);
// "foobar" has "bar" after "foo" → no match
// "crowbar" and "handlebar" match


// ============================================================
// COMBINING LOOKAROUNDS
// ============================================================
console.log('=== COMBINING LOOKAROUNDS ===\n');

// Match a word surrounded by specific context (not consumed)
show('word between @ and .com',
  /(?<=@)\w+(?=\.com)/g,
  'alice@gmail.com, bob@yahoo.com, carol@company.org'
);

// Password validation — check multiple conditions with lookaheads
function validatePassword(pw) {
  const hasMinLength  = pw.length >= 8;
  const hasUpper      = /(?=.*[A-Z])/.test(pw);
  const hasLower      = /(?=.*[a-z])/.test(pw);
  const hasDigit      = /(?=.*\d)/.test(pw);
  const hasSpecial    = /(?=.*[!@#$%^&*])/.test(pw);

  // All-in-one pattern
  const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(pw);

  console.log(`Password: "${pw}"`);
  console.log(`  length >= 8: ${hasMinLength}`);
  console.log(`  has upper:   ${hasUpper}`);
  console.log(`  has lower:   ${hasLower}`);
  console.log(`  has digit:   ${hasDigit}`);
  console.log(`  has special: ${hasSpecial}`);
  console.log(`  STRONG:      ${strong}`);
  console.log();
}

console.log('Password validation with multiple lookaheads:\n');
validatePassword('weak');
validatePassword('Str0ng!pw');
validatePassword('NoSpecial1');


// ============================================================
// PRACTICAL: add commas to numbers (classic lookahead trick)
// ============================================================
console.log('=== PRACTICAL: number formatting ===\n');

function addCommas(n) {
  // Insert commas every 3 digits from the right
  // (?=(\d{3})+$) — positive lookahead: followed by groups of 3 digits until end
  // (?<!\d) or \B to avoid leading comma
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

console.log('Add commas to large numbers:');
[1000, 1000000, 9876543210].forEach(n => {
  console.log(`  ${n}  →  ${addCommas(n)}`);
});
console.log();

// Strip HTML tags using lookarounds
replace('strip HTML tags',
  /<[^>]+>/g,
  '',
  '<p>Hello <b>world</b></p>'
);
