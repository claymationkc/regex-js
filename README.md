# Regex From Zero to Comfortable

A hands-on JavaScript regex reference. Run any file with `node <filename>`.

## Why Learn Regex?

A regular expression is a pattern that describes text. Once you know regex, a huge class of problems that would otherwise require writing loops, conditionals, and string manipulation collapse into a single line.

**Input validation** — check that a value looks right before you use it. Email addresses, phone numbers, zip codes, credit cards, dates, URLs, hex colors — all of these have well-known regex patterns that take seconds to apply and would take dozens of lines to replicate manually.

**Search and extraction** — pull structured data out of unstructured text. Scrape values from log files, parse config files, extract all URLs from a document, find every TODO comment in a codebase. Regex lets you describe *what* you're looking for rather than writing a parser from scratch.

**Find and replace** — transform text in ways that simple string replacement can't handle. Reformat dates from `YYYY-MM-DD` to `MM/DD/YYYY`, convert camelCase to snake_case, add commas to large numbers, mask sensitive data like credit card digits.

**Splitting and tokenizing** — break strings apart on complex delimiters, not just a single character. Split on any whitespace, split on commas or semicolons interchangeably, split while preserving the delimiter.

**Code and text tooling** — most editors, grep, sed, awk, and database engines all support regex. Learning it once means you can use it everywhere: VS Code's search, terminal pipelines, SQL `LIKE`/`REGEXP`, nginx rules, CI config matchers.

### When regex is the right tool

- The structure of the text is well-defined and consistent
- You need to validate, extract, or transform text in one pass
- You're working in a context where a regex engine is already available (which is almost everywhere)

### When to use something else

- Parsing deeply nested structures like HTML or JSON — use a proper parser
- The pattern is so complex it becomes unreadable — break it up or use a parser combinator
- Performance is critical at very high scale — benchmark first, regex is often fast but not always the fastest

## Files

| File | Topics |
|------|--------|
| [01_basics.js](01_basics.js) | Literals, character classes, quantifiers, anchors |
| [02_groups_and_alternation.js](02_groups_and_alternation.js) | Capturing groups, non-capturing groups, alternation |
| [03_lookahead_lookbehind.js](03_lookahead_lookbehind.js) | Lookahead, lookbehind, negative assertions |
| [04_flags_and_methods.js](04_flags_and_methods.js) | Flags (g, i, m, s, u), match/exec/test/replace/split |
| [05_common_patterns.js](05_common_patterns.js) | Email, URL, phone, date, IP, slug, credit card |
| [06_advanced.js](06_advanced.js) | Named groups, backreferences, atomic-style patterns, unicode |
| [exercises/exercises.js](exercises/exercises.js) | 20 exercises to test your knowledge |
| [exercises/solutions.js](exercises/solutions.js) | Solutions with explanations |

## Quick Cheat Sheet

### Character Classes
```
.        any character except newline
\d       digit [0-9]
\D       non-digit
\w       word char [a-zA-Z0-9_]
\W       non-word char
\s       whitespace
\S       non-whitespace
[abc]    a, b, or c
[^abc]   not a, b, or c
[a-z]    a through z
```

### Quantifiers
```
*        0 or more (greedy)
+        1 or more (greedy)
?        0 or 1
{n}      exactly n
{n,}     n or more
{n,m}    between n and m
*?       0 or more (lazy)
+?       1 or more (lazy)
```

### Anchors
```
^        start of string (or line with m flag)
$        end of string (or line with m flag)
\b       word boundary
\B       non-word boundary
```

### Groups
```
(abc)    capturing group
(?:abc)  non-capturing group
(?=abc)  positive lookahead
(?!abc)  negative lookahead
(?<=abc) positive lookbehind
(?<!abc) negative lookbehind
(?<name>abc) named capturing group
```

### Flags
```
g   global — find all matches
i   case insensitive
m   multiline — ^ and $ match line boundaries
s   dotAll — . matches newline too
u   unicode — enables full unicode support
```
