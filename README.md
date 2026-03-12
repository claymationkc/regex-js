# Regex From Zero to Comfortable

A hands-on JavaScript regex reference. Run any file with `node <filename>`.

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
