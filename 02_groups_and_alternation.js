// ============================================================
// 02 — GROUPS & ALTERNATION
// Run: node 02_groups_and_alternation.js
// ============================================================

function show(label, regex, str) {
  const m = str.match(regex);
  console.log(`${label}`);
  console.log(`  /${regex.source}/${regex.flags}  on  "${str}"`);
  if (!m) {
    console.log(`  result: no match`);
  } else {
    console.log(`  full match:  "${m[0]}"`);
    if (m.length > 1) {
      for (let i = 1; i < m.length; i++) {
        console.log(`  group ${i}:     "${m[i]}"`);
      }
    }
  }
  console.log();
}


// ============================================================
// CAPTURING GROUPS — (...)
// Parentheses group AND capture the matched text.
// Captured groups are returned as m[1], m[2], etc.
// ============================================================
console.log('=== CAPTURING GROUPS ===\n');

// Basic capture
show('capture year-month-day',
  /(\d{4})-(\d{2})-(\d{2})/,
  'Date: 2024-03-15'
);
// m[0] = "2024-03-15", m[1] = "2024", m[2] = "03", m[3] = "15"

// Capture lets you rearrange with replace
const date = '2024-03-15';
const reordered = date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
console.log('Reformat date with $1 $2 $3:');
console.log(`  "2024-03-15"  →  "${reordered}"`);
console.log();

// Nested groups — outer group includes inner group
show('nested groups',
  /(a(b(c)))/,
  'abc'
);
// m[1]="abc", m[2]="bc", m[3]="c"

// Repeated group — group captures LAST match only
show('repeated group captures last',
  /(\d+,)*/,
  '1,2,3,'
);
// The group (\d+,) matches 3 times but only last ("3,") is captured.
// Use matchAll or a different approach to get all repeats.


// ============================================================
// NON-CAPTURING GROUPS — (?:...)
// Group for quantifier/alternation purposes, but don't capture.
// Faster and cleaner when you don't need the group value.
// ============================================================
console.log('=== NON-CAPTURING GROUPS ===\n');

show('capturing group (wastes a slot)',
  /(ha)+/,
  'hahaha'
);
// m[1] = "ha" (last repetition)

show('non-capturing group (?:...)',
  /(?:ha)+/,
  'hahaha'
);
// No groups captured — m[1] is undefined

// Real use case: group for quantifier without polluting captures
show('only capture the important part',
  /(?:Mr|Ms|Dr)\. (\w+)/,
  'Hello Dr. Smith'
);
// m[1] = "Smith" — title is grouped for alternation but not captured


// ============================================================
// ALTERNATION — a|b
// | means OR. Lower precedence than concatenation.
// Use groups to scope it.
// ============================================================
console.log('=== ALTERNATION ===\n');

show('cat or dog',
  /cat|dog/,
  'I have a dog'
);

// Without grouping, | has very low precedence:
// /^cat|dog$/ means  (^cat) | (dog$)  — NOT  ^(cat|dog)$
show('WRONG: ^cat|dog$ means (^cat)|(dog$)',
  /^cat|dog$/,
  'dog food'  // matches because "dog" is at start... wait, let's see
);

show('RIGHT: ^(cat|dog)$ anchors both',
  /^(cat|dog)$/,
  'dog'   // matches
);
show('RIGHT: ^(cat|dog)$ — no match on partial',
  /^(cat|dog)$/,
  'dog food'  // no match
);

// Alternation tries left-to-right and stops on first match
show('first match wins: gray|grey',
  /gray|grey/,
  'colour is grey'
);
// Equivalent and cleaner: gr(a|e)y
show('cleaner: gr(a|e)y',
  /gr(a|e)y/,
  'colour is grey'
);
// Even cleaner: gr[ae]y  (character class, no capture needed)
show('cleanest: gr[ae]y',
  /gr[ae]y/,
  'colour is grey'
);


// ============================================================
// PRACTICAL: parsing structured strings
// ============================================================
console.log('=== PRACTICAL EXAMPLES ===\n');

// Parse "key: value" pairs
const config = 'host: localhost';
const kvMatch = config.match(/^(\w+):\s*(.+)$/);
console.log('Parse key:value');
console.log(`  input: "${config}"`);
console.log(`  key:   "${kvMatch[1]}"`);
console.log(`  value: "${kvMatch[2]}"`);
console.log();

// Extract protocol and domain from a URL-like string
const url = 'https://example.com/path';
const urlMatch = url.match(/^(https?):\/\/([^/]+)(\/.*)?$/);
console.log('Parse URL');
console.log(`  input:    "${url}"`);
console.log(`  protocol: "${urlMatch[1]}"`);
console.log(`  domain:   "${urlMatch[2]}"`);
console.log(`  path:     "${urlMatch[3] ?? '(none)'}"`);
console.log();

// Find all matches with capturing groups using matchAll
const log = '2024-01-05 ERROR: disk full\n2024-01-06 WARN: low memory\n2024-01-07 INFO: started';
console.log('Extract all log entries:');
for (const m of log.matchAll(/^(\d{4}-\d{2}-\d{2}) (\w+): (.+)$/gm)) {
  console.log(`  date=${m[1]}  level=${m[2]}  msg="${m[3]}"`);
}
console.log();
