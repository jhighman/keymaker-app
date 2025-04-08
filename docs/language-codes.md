# Language Codes

## Overview

The KeyMaker specification uses two-letter language codes to specify the language for the background check process. These codes are based on ISO 639-1 language codes.

## Supported Languages

| Code | Language | Description |
|------|----------|-------------|
| en   | English  | English language interface and documentation |
| es   | Spanish  | Spanish language interface and documentation |
| fr   | French   | French language interface and documentation |

## Usage

The language code is the first two characters of the key:
```
[Language Code (2)][Rest of Key...]
```

Example:
- `en1000000000000` - English interface
- `es1000000000000` - Spanish interface
- `fr1000000000000` - French interface

## Implementation Notes

1. Language codes are case-sensitive and must be lowercase
2. Only supported language codes are valid
3. The language code affects:
   - User interface language
   - Documentation language
   - Form labels and instructions
   - Error messages
   - Consent forms
   - Verification instructions

## Future Considerations

The specification may be extended to support additional languages in future versions. Any new language codes will be added to this documentation. 