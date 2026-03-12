// ============================================================
// 05 — COMMON REAL-WORLD PATTERNS
// Run: node 05_common_patterns.js
// ============================================================
//
// These are production-grade (or close to it) patterns with
// explanations of every design decision.
//

function validate(label, regex, examples) {
  console.log(`${label}`);
  console.log(`  Pattern: /${regex.source}/`);
  examples.forEach(([str, expected]) => {
    const result = regex.test(str);
    const icon = result === expected ? '✓' : '✗ WRONG';
    console.log(`  ${icon}  "${str}"  →  ${result}`);
  });
  console.log();
}

function extract(label, regex, str) {
  const gRegex = regex.flags.includes('g') ? regex : new RegExp(regex.source, regex.flags + 'g');
  const matches = [...str.matchAll(gRegex)].map(m => ({
    match: m[0],
    groups: m.groups ?? null,
  }));
  console.log(`${label}`);
  console.log(`  Input: "${str}"`);
  matches.forEach(({ match, groups }) => {
    if (groups && Object.keys(groups).length) {
      console.log(`  → "${match}"`, JSON.stringify(groups));
    } else {
      console.log(`  → "${match}"`);
    }
  });
  console.log();
}


// ============================================================
// EMAIL
// ============================================================
console.log('=== EMAIL ===\n');
// RFC 5322 is insanely complex. This covers 99% of real emails.
const EMAIL = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
//             ^^^^^^^^^^^^^^^^^^^^^^^  local part
//                                     ^  @ sign
//                                       ^^^^^^^^^^^^^^^^^^^^^ domain
//                                                          ^^^^^^^^^^^^^^^ TLD (2+ chars)

validate('Email validation', EMAIL, [
  ['user@example.com',         true],
  ['user.name+tag@sub.co.uk',  true],
  ['user@localhost',           false],  // no TLD
  ['@example.com',             false],  // no local part
  ['user @example.com',        false],  // space
  ['user@.com',                false],  // domain starts with dot
]);

// Extract all emails from text
extract(
  'Extract emails from text',
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  'Contact alice@example.com or bob.smith@company.org for help'
);


// ============================================================
// URL
// ============================================================
console.log('=== URL ===\n');
const URL_PATTERN = /^(https?):\/\/([a-zA-Z0-9\-\.]+)(?::(\d+))?(\/[^\s?#]*)?(\?[^\s#]*)?(#\S*)?$/;
//                   ^^^^^^^^        ^^^^^^^^^^^^^^^^^^^   ^^^^^^   ^^^^^^^^^^^  ^^^^^^^^^^  ^^^^^
//                   protocol        hostname               port     path         query       fragment

validate('URL validation', URL_PATTERN, [
  ['https://example.com',                true],
  ['http://sub.domain.co.uk/path/here',  true],
  ['https://example.com:8080/api?q=1',   true],
  ['ftp://example.com',                  false],  // ftp not covered
  ['example.com',                        false],  // no protocol
  ['https://',                           false],  // no host
]);

// Extract URL parts with named groups
const urlRegex = /^(?<protocol>https?):\/\/(?<host>[a-zA-Z0-9\-\.]+)(?::(?<port>\d+))?(?<path>\/[^\s?#]*)?(?<query>\?[^\s#]*)?(?<fragment>#\S*)?$/;
const testUrl = 'https://api.example.com:443/v1/users?sort=asc#top';
const urlMatch = testUrl.match(urlRegex);
if (urlMatch?.groups) {
  console.log('URL parts from named groups:');
  Object.entries(urlMatch.groups).forEach(([k, v]) => {
    if (v !== undefined) console.log(`  ${k.padEnd(10)} = "${v}"`);
  });
  console.log();
}


// ============================================================
// PHONE NUMBER
// ============================================================
console.log('=== PHONE NUMBER ===\n');
// Flexible US phone: (123) 456-7890 | 123-456-7890 | 1234567890 | +1 123 456 7890
const PHONE_US = /^(\+1[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/;

validate('US phone number', PHONE_US, [
  ['(123) 456-7890',    true],
  ['123-456-7890',      true],
  ['1234567890',        true],
  ['+1 123 456 7890',   true],
  ['+1-800-555-0100',   true],
  ['12345',             false],
  ['(123) 456-78901',   false],  // too long
]);

// Extract with named groups
extract(
  'Extract phone numbers',
  /(?<area>\d{3})[\s\-.](?<exchange>\d{3})[\s\-.](?<number>\d{4})/g,
  'Call 555-867-5309 or (800) 555.0199 for support'
);


// ============================================================
// DATE
// ============================================================
console.log('=== DATE ===\n');
// ISO 8601: YYYY-MM-DD
const DATE_ISO = /^(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\d|3[01])$/;
//                                        ^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^
//                                        month 01-12        day 01-31

validate('ISO date (YYYY-MM-DD)', DATE_ISO, [
  ['2024-03-15',  true],
  ['2024-12-31',  true],
  ['2024-13-01',  false],  // invalid month
  ['2024-00-15',  false],  // invalid month
  ['2024-03-32',  false],  // invalid day
  ['24-03-15',    false],  // 2-digit year
  ['2024/03/15',  false],  // wrong separator
]);

// US format: MM/DD/YYYY
const DATE_US = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;
validate('US date (MM/DD/YYYY)', DATE_US, [
  ['03/15/2024',  true],
  ['12/31/2024',  true],
  ['13/01/2024',  false],
]);


// ============================================================
// IP ADDRESS
// ============================================================
console.log('=== IP ADDRESS ===\n');
// IPv4: each octet 0-255
const OCTET = /(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)/;
//             ^^^^^^^^^^^  ^^^^^^^^  ^^^^^^  ^^^^^^  ^^
//             250-255      200-249   100-199  10-99   0-9
const IPV4 = new RegExp(`^(?:${OCTET.source}\\.){3}${OCTET.source}$`);

validate('IPv4 address', IPV4, [
  ['192.168.1.1',    true],
  ['0.0.0.0',        true],
  ['255.255.255.255', true],
  ['256.0.0.1',      false],   // 256 invalid
  ['192.168.1',      false],   // only 3 octets
  ['192.168.1.1.1',  false],   // 5 octets
  ['192.168.01.1',   false],   // leading zero (strict)
]);

const IPV4_G = new RegExp(IPV4.source, 'g');
extract('Extract IPs from log', IPV4_G, '10.0.0.1 connected, 192.168.1.100 disconnected, 999.0.0.1 invalid');


// ============================================================
// SLUG (URL-friendly string)
// ============================================================
console.log('=== SLUG ===\n');
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
//            ^^^^^^^^^^^ one or more alphanumeric
//                       ^^^^^^^^^^^^^^^^^ zero or more -word groups

validate('URL slug', SLUG, [
  ['hello-world',       true],
  ['my-post-123',       true],
  ['single',            true],
  ['Hello-World',       false],  // uppercase
  ['-leading-dash',     false],
  ['trailing-dash-',    false],
  ['double--dash',      false],
]);

// Function to create a slug from any string
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // remove non-word chars
    .replace(/[\s_-]+/g, '-')      // spaces/underscores to hyphens
    .replace(/^-+|-+$/g, '');      // trim leading/trailing hyphens
}

console.log('slugify() examples:');
['Hello World!', 'My Post -- Title', '  spaces   around  ', 'Über café résumé'].forEach(s => {
  console.log(`  "${s}"  →  "${slugify(s)}"`);
});
console.log();


// ============================================================
// CREDIT CARD (pattern only — real validation uses Luhn)
// ============================================================
console.log('=== CREDIT CARD ===\n');
const CARDS = {
  Visa:       /^4\d{12}(?:\d{3})?$/,                  // 13 or 16 digits starting with 4
  Mastercard: /^5[1-5]\d{14}$/,                        // 16 digits starting with 51-55
  Amex:       /^3[47]\d{13}$/,                         // 15 digits starting with 34 or 37
  Discover:   /^6(?:011|5\d{2})\d{12}$/,              // 16 digits
};

const testCards = ['4111111111111111', '5500000000000004', '378282246310005', '6011111111111117'];
testCards.forEach(card => {
  const type = Object.entries(CARDS).find(([, re]) => re.test(card))?.[0] ?? 'Unknown';
  console.log(`  ${card}  →  ${type}`);
});
console.log();


// ============================================================
// HEX COLOR
// ============================================================
console.log('=== HEX COLOR ===\n');
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

validate('Hex color', HEX_COLOR, [
  ['#fff',      true],
  ['#FFF',      true],
  ['#a1b2c3',   true],
  ['#A1B2C3',   true],
  ['fff',        false],  // missing #
  ['#gg0000',    false],  // invalid hex char
  ['#12345',     false],  // 5 digits
]);


// ============================================================
// SEMANTIC VERSION
// ============================================================
console.log('=== SEMVER ===\n');
const SEMVER = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>[a-zA-Z0-9\-.]+))?(?:\+(?<build>[a-zA-Z0-9\-.]+))?$/;

validate('Semantic version', SEMVER, [
  ['1.0.0',           true],
  ['1.2.3',           true],
  ['0.0.1',           true],
  ['1.0.0-alpha.1',   true],
  ['1.0.0+build.123', true],
  ['01.0.0',          false],  // leading zero
  ['1.0',             false],  // missing patch
  ['v1.0.0',          false],  // v prefix not allowed
]);

extract('Extract semver', SEMVER, 'App 2.1.0 requires lib 1.4.5-beta and plugin 3.0.0+exp.sha.5114f85');
