# scit.js

This is a small script and style to make it easy to write and publish "scits" (pronounced "skits").

Scits are Self-Critical Interactive Texts, a web-based genre of writing akin to using long footnotes, except those footnotes can also have footnotes, and so on. It is best explained by viewing `example.html`.

This script is designed to play well with Markdown-based blogging engines, without requiring a Markdown installation. The grammar is described below, and can be seen in `example.md`.

## Genre Components

A scit has three components:

* The **source text**, which is a set of paragraphs (`<p></p>`s) and should be short enough to invite a quick read on a web-enabled device.

* **Critiques**, which are paragraphs that (i) are initially hidden from view, (ii) reference a specific quote (called a "tie") from the source text or another critique, (iii) appear automatically when the referenced quote nears the top of the screen, and (iv) belong to a specific voice (person or perspective making the critique). These add commentary to the source text or other critiques and are intended to further the development of the scit's central argument or themes rhetorically.

* **Ties**, which are the specific quotes mentioned above. Whenever a tie approaches the top of the screen, it becomes underlined at the same time that the corresponding critique(s) come(s) into view.

## Component Relationships

A scit contains any number of paragraphs. Each paragraph may either belong to the source text or is a critique. Each paragraph may contain any number of ties. Each tie corresponds to at least one critique. Each critique corresponds to exactly one tie and exactly one voice. Each voice corresponds to at least one critique. Each voice has a unique identifier and color/style.

The important take away here is that more than one critique may refer to the exact same quote.

## Grammar (Informal)

Each critique should come after the quote it is tied to. This is not required as fas as the script's logic goes, but it will make much less sense to the reader.

A tie is text within a paragraph written like `[[this and this and this|AB,CD,EF]]`, where `AB`, `CD`, and `EF` are three example identifiers for three different voices. These can be any letters-only word, but convention has it that each identifier is taken from the initials of the name of the person that the critique belongs to. Usually, only one identifier is used for each tie.

The paragraph that contains that tie should be followed by three paragraphs that look like:

```
[[AB: Here is one critique.]]

[[CD: And another critique.
]]

[[EF:
    And one more.
]]
```

## Grammar (formal)

A tie matches the regular expression `/\[\[([^|]+|(.+)\]\]/`, where `$1` is the text being quoted and `$2` is the comma-separated list of voice identifiers.

A critique matches the regular expression `/^\[\[([^:]+):(.+)\]\]$/`, where `$1` is the identifier of the voice making the critique and `$2` is the text of the critique. **Note that this means that the first and last characters of the paragraph's `innerHTML` must be [[ and ]] respectively.**