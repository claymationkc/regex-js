// ============================================================
// SOLUTIONS — with explanations
// Run: node exercises/solutions.js
// ============================================================

function run(num, description, YOUR_REGEX, cases) {
  console.log(`Exercise ${num}: ${description}`);
  let passed = 0;
  for (const [input, expected] of cases) {
    const actual = typeof expected === 'boolean'
      ? YOUR_REGEX.test(input)
      : (input.match(YOUR_REGEX)?.[0] ?? null);
    const ok = actual === expected;
    const icon = ok ? '✓' : '✗';
    if (ok) passed++;
    console.log(`  ${icon} "${input}"  →  ${JSON.stringify(expected)}${ok ? '' : `  got: ${JSON.stringify(actual)}`}`);
  }
  console.log(`  ${passed}/${cases.length} passed\n`);
}


// ============================================================
// BASICS
// ============================================================

run(1, 'Match 3-digit number (100-999)',
  // [1-9] ensures first digit isn't 0 (so no 099)
  // \d{2} for remaining two digits
  // \b word boundary prevents matching inside larger numbers
  /\b[1-9]\d{2}\b/,
  [
    ['abc 500 xyz', '500'],
    ['abc 50 xyz',  null],
    ['abc 1000',    null],
    ['no numbers',  null],
  ]
);

run(2, 'Match a capitalized word',
  // [A-Z] — starts with uppercase
  // [a-zA-Z]* — followed by any letters (0 or more)
  // \b — word boundary so we don't match mid-word
  /\b[A-Z][a-zA-Z]*/,
  [
    ['Hello world', 'Hello'],
    ['hello World', 'World'],
    ['all lower',   null],
    ['ALLCAPS',     'ALLCAPS'],
  ]
);

run(3, 'Validate all-lowercase string (boolean)',
  // ^ and $ anchor to full string
  // [a-z]+ — one or more lowercase letters
  // No spaces, digits, or other chars allowed
  /^[a-z]+$/,
  [
    ['hello',     true],
    ['Hello',     false],
    ['hello123',  false],
    ['hello world', false],
    ['abc',       true],
  ]
);

run(4, 'Find "is" as a whole word',
  // \b on both sides ensures "is" is not part of a larger word
  // Without \b: "this" would match
  /\bis\b/,
  [
    ['this is nice', 'is'],
    ['island',       null],
    ['this',         null],
    ['is it?',       'is'],
  ]
);

run(5, 'Match 1-3 repetitions of "ab"',
  // (ab){1,3} — group "ab" and repeat 1 to 3 times
  // Anchoring with ^ and $ would require the whole string to be ab/abab/ababab
  // Without anchors, matches first 1-3 repetitions found
  /(ab){1,3}/,
  [
    ['ab',        'ab'],
    ['abab',      'abab'],
    ['ababab',    'ababab'],
    ['ababababababab', 'ababab'],
    ['cd',        null],
  ]
);


// ============================================================
// CHARACTER CLASSES & QUANTIFIERS
// ============================================================

run(6, 'US zip code (12345 or 12345-6789)',
  // \d{5} — exactly 5 digits
  // (?:-\d{4})? — optionally: a dash followed by exactly 4 digits
  // ^ and $ — full string match
  /^\d{5}(?:-\d{4})?$/,
  [
    ['90210',       '90210'],
    ['90210-1234',  '90210-1234'],
    ['9021',        null],
    ['902100',      null],
    ['90210-123',   null],
  ]
);

run(7, 'CSS hex color (#rgb or #rrggbb)',
  // # — literal hash
  // [0-9a-fA-F] — hex digit character class
  // {3}(?:[0-9a-fA-F]{3})? — 3 hex digits, optionally followed by 3 more (= 3 or 6 total)
  // No anchors — runner extracts first match via match()[0]
  /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?/,
  [
    ['color: #fff',      '#fff'],
    ['color: #FFF',      '#FFF'],
    ['color: #a1b2c3',   '#a1b2c3'],
    ['color: #1234',     '#123'],   // 4 hex digits → only first 3 matched
    ['no hash ff0000',   null],
  ]
);

run(8, 'Float (e.g. 3.14, -0.5, 42)',
  // -? — optional negative sign
  // \d* — zero or more digits before decimal
  // \.? — optional decimal point
  // \d+ — one or more digits
  // The whole pattern must match something numeric
  /-?\d*\.?\d+/,
  [
    ['3.14',   '3.14'],
    ['-0.5',   '-0.5'],
    ['42',     '42'],
    ['.5',     '.5'],
    ['abc',    null],
    ['1.2.3',  '1.2'],
  ]
);


// ============================================================
// GROUPS & CAPTURING
// ============================================================

run(9, 'Capture domain from email',
  // (?<=@) — lookbehind: must be preceded by @
  // [\w.]+ — word chars and dots (the domain)
  // The lookbehind means @ is NOT part of the match
  /(?<=@)[\w.]+/,
  [
    ['user@example.com',       'example.com'],
    ['alice@sub.domain.co.uk', 'sub.domain.co.uk'],
    ['notanemail',             null],
  ]
);

run(10, 'Filename without extension',
  // (?<=[/\\]|^) — lookbehind: after a slash or start of string
  // [\w.]+ — filename with possible dots
  // (?=\.[^./\\]+$) — lookahead: followed by .extension at end of string
  // OR: match everything after last slash, before last dot
  /[^/\\]+(?=\.[^./\\]*$)|[^/\\]+$/,
  [
    ['path/to/file.txt',     'file'],
    ['readme.md',            'readme'],
    ['/usr/local/bin/node',  'node'],
    ['archive.tar.gz',       'archive.tar'],
  ]
);


// ============================================================
// LOOKAHEADS & LOOKBEHINDS
// ============================================================

run(11, 'Number followed by " dollars"',
  // \d+ — one or more digits
  // (?= dollars) — positive lookahead: must be followed by " dollars"
  /\d+(?= dollars)/,
  [
    ['I have 50 dollars',     '50'],
    ['50 cents',              null],
    ['100 dollars or 50',     '100'],
  ]
);

run(12, 'Word NOT followed by comma',
  // \w+ — a word
  // (?!,) — negative lookahead: NOT followed by comma
  // This will match any word not immediately followed by a comma
  /\w+(?!,)\b/,
  [
    ['one, two, three',  'three'],
    ['one two three',    'one'],
    ['a, b, c',          'c'],
  ]
);
// Note: "one" doesn't match in "one, two, three" because "one" is followed by ","

run(13, 'Dollar amount not after "discount "',
  // (?<!discount )\$\d+ — negative lookbehind
  /(?<!discount )\$\d+/,
  [
    ['total $50',             '$50'],
    ['discount $10 off',      null],
    ['pay $200 not discount $30', '$200'],
  ]
);


// ============================================================
// REPLACE CHALLENGES
// ============================================================

function camelToSnake(str) {
  // Find each uppercase letter and replace with _lowercase
  // (?<=[a-z\d]) ensures we don't add _ at the very start
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}
console.log('Exercise 14: camelCase → snake_case');
[
  ['myVariableName',  'my_variable_name'],
  ['helloWorld',      'hello_world'],
  ['alreadylower',    'alreadylower'],
  ['XMLParser',       'x_m_l_parser'],
].forEach(([input, expected]) => {
  const result = camelToSnake(input);
  console.log(`  ${result === expected ? '✓' : '✗'} "${input}"  →  "${result}"  (expected "${expected}")`);
});
console.log();

function maskCard(str) {
  // Replace all digits with * except the last 4
  // (?=(?:\d[\s-]?){4}$) — lookahead: 4 digits until end (with optional separators)
  // Simpler approach: replace all \d that are NOT among the last 4 digits
  return str.replace(/\d(?=(?:\d|\s|-)*\d{4}(?:\s|-)?$)/g, '*');
}
// Even simpler: strip separators, mask, re-add if needed
// But the lookahead approach works for common formats:
function maskCardSimple(str) {
  return str.replace(/\d(?=\d{4}(?:\s|-|$))/g, '*');
}
console.log('Exercise 15: mask credit card');
[
  ['4111 1111 1111 1234', '**** **** **** 1234'],
  ['1234567890123456',    '************3456'],
].forEach(([input, expected]) => {
  const result = maskCardSimple(input);
  console.log(`  ${result === expected ? '✓' : '✗'} "${input}"  →  "${result}"`);
});
console.log();

function stripTags(html) {
  // <   — opening angle bracket
  // [^>]+ — one or more chars that are NOT >  (the tag content)
  // >   — closing angle bracket
  return html.replace(/<[^>]+>/g, '');
}
console.log('Exercise 16: strip HTML tags');
[
  ['<p>Hello <b>world</b></p>', 'Hello world'],
  ['<a href="#">click</a>',     'click'],
  ['no tags here',              'no tags here'],
].forEach(([input, expected]) => {
  const result = stripTags(input);
  console.log(`  ${result === expected ? '✓' : '✗'} "${input}"  →  "${result}"`);
});
console.log();

function normalizeWhitespace(str) {
  return str
    .replace(/\s+/g, ' ')   // collapse all whitespace sequences to single space
    .trim();                  // remove leading/trailing spaces
}
console.log('Exercise 17: normalize whitespace');
[
  ['  hello   world  ', 'hello world'],
  ['one\ttwo\nthree',   'one two three'],
  ['no  extra',         'no extra'],
].forEach(([input, expected]) => {
  const result = normalizeWhitespace(input);
  console.log(`  ${result === expected ? '✓' : '✗'} "${input}"  →  "${result}"`);
});
console.log();


// ============================================================
// ADVANCED
// ============================================================

run(18, 'Find duplicate consecutive words',
  // \b — word boundary
  // (\w+) — capture a word
  // \s+ — whitespace between them
  // \1 — backreference: must match the same word captured in group 1
  // \b — word boundary
  /\b(\w+)\s+\1\b/i,
  [
    ['the the fox',        'the the'],
    ['no duplicates here', null],
    ['go go go',           'go go'],
    ['abc abc',            'abc abc'],
  ]
);

run(19, 'Strong password validation',
  // Multiple lookaheads, each asserting a requirement:
  // (?=.*[A-Z])    — contains at least one uppercase letter
  // (?=.*[a-z])    — contains at least one lowercase letter
  // (?=.*\d)       — contains at least one digit
  // (?=.*[!@#$%^&*]) — contains at least one special char
  // .{8,}          — at least 8 chars total
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
  [
    ['Str0ng!pw',    true],
    ['weak',         false],
    ['NoDigits!',    false],
    ['nouppercase1!', false],
    ['NOLOWER1!',    false],
    ['NoSpecial1',   false],
    ['Sh0rt!',       false],
    ['LongEnough1!', true],
  ]
);

run(20, 'Valid IPv4 address',
  // Each octet: 25[0-5] (250-255) | 2[0-4]\d (200-249) | 1\d{2} (100-199) | [1-9]\d (10-99) | \d (0-9)
  // (?:octet\.){3}octet — three octets with dots, then final octet
  // ^ and $ — full string
  /^(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)){3}$/,
  [
    ['192.168.1.1',     true],
    ['0.0.0.0',         true],
    ['255.255.255.255', true],
    ['256.0.0.1',       false],
    ['192.168.1',       false],
    ['192.168.1.1.1',   false],
    ['192.168.1.999',   false],
  ]
);
