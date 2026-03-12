// ============================================================
// EXERCISES — 20 challenges to test your regex knowledge
// Run: node exercises/exercises.js
//
// Each exercise has:
//   - A description
//   - A set of test cases [input, expected]
//   - YOUR_REGEX — replace null with your pattern
//
// The runner will tell you which pass and which fail.
// See solutions.js for answers with explanations.
// ============================================================

function run(num, description, YOUR_REGEX, cases) {
  console.log(`Exercise ${num}: ${description}`);
  if (!YOUR_REGEX) {
    console.log('  [ not attempted ]\n');
    return;
  }
  let passed = 0;
  for (const [input, expected] of cases) {
    const actual = typeof expected === 'boolean'
      ? YOUR_REGEX.test(input)
      : (input.match(YOUR_REGEX)?.[0] ?? null);
    const ok = actual === expected;
    const icon = ok ? '✓' : '✗';
    if (ok) passed++;
    console.log(`  ${icon} "${input}"  →  expected: ${JSON.stringify(expected)}${ok ? '' : `  got: ${JSON.stringify(actual)}`}`);
  }
  console.log(`  ${passed}/${cases.length} passed\n`);
}

// ============================================================
// BASICS
// ============================================================

// 1. Match any 3-digit number (100-999)
run(1, 'Match 3-digit number (100-999)',
  null, // YOUR_REGEX here
  [
    ['abc 500 xyz', '500'],
    ['abc 50 xyz',  null],   // 2 digits — no match
    ['abc 1000',    null],   // 4 digits — no match
    ['no numbers',  null],
  ]
);

// 2. Match a word that starts with a capital letter
run(2, 'Match a capitalized word',
  null,
  [
    ['Hello world', 'Hello'],
    ['hello World', 'World'],
    ['all lower',   null],
    ['ALLCAPS',     'ALLCAPS'],
  ]
);

// 3. Match a string that contains ONLY lowercase letters (no spaces, no digits)
run(3, 'Validate all-lowercase string (boolean)',
  null,
  [
    ['hello',     true],
    ['Hello',     false],
    ['hello123',  false],
    ['hello world', false],
    ['abc',       true],
  ]
);

// 4. Match a word boundary — find "is" as a standalone word (not inside "this" or "island")
run(4, 'Find "is" as a whole word',
  null,
  [
    ['this is nice', 'is'],
    ['island',       null],
    ['this',         null],
    ['is it?',       'is'],
  ]
);

// 5. Match 1 to 3 repetitions of "ab" (i.e., ab, abab, or ababab)
run(5, 'Match 1-3 repetitions of "ab"',
  null,
  [
    ['ab',        'ab'],
    ['abab',      'abab'],
    ['ababab',    'ababab'],
    ['ababababababab', 'ababab'],  // matches first 3 (lazy doesn't matter here — greedy is fine)
    ['cd',        null],
  ]
);


// ============================================================
// CHARACTER CLASSES & QUANTIFIERS
// ============================================================

// 6. Match a US zip code: 5 digits, optionally followed by -4 digits
run(6, 'US zip code (12345 or 12345-6789)',
  null,
  [
    ['90210',       '90210'],
    ['90210-1234',  '90210-1234'],
    ['9021',        null],    // too short
    ['902100',      null],    // too long without dash
    ['90210-123',   null],    // dash group too short
  ]
);

// 7. Match a CSS hex color: #rgb or #rrggbb (case insensitive)
run(7, 'CSS hex color (#rgb or #rrggbb)',
  null,
  [
    ['color: #fff',      '#fff'],
    ['color: #FFF',      '#FFF'],
    ['color: #a1b2c3',   '#a1b2c3'],
    ['color: #1234',     '#123'],  // 4 hex digits — only first 3 match
    ['no hash ff0000',   null],   // missing #
  ]
);

// 8. Match a floating point number (may be negative, may have no decimal)
run(8, 'Float (e.g. 3.14, -0.5, 42)',
  null,
  [
    ['3.14',   '3.14'],
    ['-0.5',   '-0.5'],
    ['42',     '42'],
    ['.5',     '.5'],
    ['abc',    null],
    ['1.2.3',  '1.2'],  // first valid float
  ]
);


// ============================================================
// GROUPS & CAPTURING
// ============================================================

// 9. Capture the domain from an email address (the part after @)
run(9, 'Capture domain from email',
  null,
  [
    ['user@example.com',       'example.com'],
    ['alice@sub.domain.co.uk', 'sub.domain.co.uk'],
    ['notanemail',             null],
  ]
);
// Hint: use match()[1] for group capture — but the runner uses match()[0]
// For this exercise, write a regex where the FULL match IS the domain
// i.e., use lookbehind: (?<=@)[\w.]+

// 10. Extract the filename (without extension) from a file path
run(10, 'Filename without extension',
  null,
  [
    ['path/to/file.txt',     'file'],
    ['readme.md',            'readme'],
    ['/usr/local/bin/node',  'node'],  // no extension
    ['archive.tar.gz',       'archive.tar'],  // last dot only
  ]
);
// Hint: match the filename portion, then remove the last .ext


// ============================================================
// LOOKAHEADS & LOOKBEHINDS
// ============================================================

// 11. Match a number only if it's followed by " dollars"
run(11, 'Number followed by " dollars"',
  null,
  [
    ['I have 50 dollars',     '50'],
    ['50 cents',              null],
    ['100 dollars or 50',     '100'],
  ]
);

// 12. Match a word that is NOT followed by a comma
run(12, 'Word NOT followed by comma',
  null,
  [
    ['one, two, three',  'three'],   // only last word (no comma after)
    ['one two three',    'one'],     // first match with no comma
    ['a, b, c',          'c'],
  ]
);
// Hint: use \w+ with a negative lookahead for comma, and match first occurrence

// 13. Find a $ amount NOT preceded by "discount"
run(13, 'Dollar amount not after "discount "',
  null,
  [
    ['total $50',             '$50'],
    ['discount $10 off',      null],
    ['pay $200 not discount $30', '$200'],
  ]
);


// ============================================================
// REPLACE CHALLENGES
// ============================================================

// For exercises 14-17, write a function using .replace() or .replaceAll()

// 14. Camel case to snake_case:  "myVariableName"  → "my_variable_name"
function camelToSnake(str) {
  // YOUR CODE HERE
  return str;
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

// 15. Mask all but the last 4 digits of a credit card number
function maskCard(str) {
  // "4111 1111 1111 1234"  →  "**** **** **** 1234"
  // YOUR CODE HERE
  return str;
}
console.log('Exercise 15: mask credit card');
[
  ['4111 1111 1111 1234', '**** **** **** 1234'],
  ['1234567890123456',    '************3456'],
].forEach(([input, expected]) => {
  const result = maskCard(input);
  console.log(`  ${result === expected ? '✓' : '✗'} "${input}"  →  "${result}"`);
});
console.log();

// 16. Remove all HTML tags from a string
function stripTags(html) {
  // YOUR CODE HERE
  return html;
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

// 17. Truncate repeated whitespace (multiple spaces → single space, trim ends)
function normalizeWhitespace(str) {
  // YOUR CODE HERE
  return str;
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

// 18. Find all duplicate consecutive words (like "the the")
run(18, 'Find duplicate consecutive words',
  null,
  [
    ['the the fox',        'the the'],
    ['no duplicates here', null],
    ['go go go',           'go go'],    // first pair
    ['abc abc',            'abc abc'],
  ]
);

// 19. Validate a strong password:
//   - At least 8 characters
//   - At least one uppercase letter
//   - At least one lowercase letter
//   - At least one digit
//   - At least one special char: !@#$%^&*
run(19, 'Strong password validation',
  null,
  [
    ['Str0ng!pw',    true],
    ['weak',         false],
    ['NoDigits!',    false],
    ['nouppercase1!', false],
    ['NOLOWER1!',    false],
    ['NoSpecial1',   false],
    ['Sh0rt!',       false],   // only 6 chars
    ['LongEnough1!', true],
  ]
);

// 20. Match a valid IPv4 address
run(20, 'Valid IPv4 address',
  null,
  [
    ['192.168.1.1',     true],
    ['0.0.0.0',         true],
    ['255.255.255.255', true],
    ['256.0.0.1',       false],   // 256 invalid
    ['192.168.1',       false],   // only 3 octets
    ['192.168.1.1.1',   false],   // 5 octets
    ['192.168.1.999',   false],   // 999 invalid
  ]
);
