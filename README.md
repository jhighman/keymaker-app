# KeyMaker Specification

## Overview

KeyMaker is a specification for encoding background check requirements in a compact, human-readable format. It provides a standardized way to specify language preferences, consent requirements, verification steps, and timeline requirements for background checks.

## Documentation Structure

The specification is organized into the following documents:

- [Key Structure](docs/key-structure.md) - Detailed breakdown of the key format and its components
- [Language Codes](docs/language-codes.md) - Supported languages and their codes
- [Consent Options](docs/consent-options.md) - Available consent requirements
- [Verification Steps](docs/verification-steps.md) - Background check verification steps
- [Timeline Specifications](docs/timeline-specifications.md) - Timeline requirements for history checks
- [Validation Rules](docs/validation-rules.md) - Rules for validating keys
- [Usage Examples](docs/usage-examples.md) - Practical examples and use cases
- [Technical Implementation](docs/technical-implementation.md) - Implementation guidelines and code examples

## Quick Reference

### Key Format
```
[Language Code (2)][Initial Bit (1)][Consents (3)][Steps (4)][Residence Timeline (3)][Employment Timeline (3)]
```

### Example Key
```
en1000000000000
```
Breaking down the example:
- Language: English (en)
- Initial Bit: 1
- Consents: None (000)
- Steps: None (0000)
- Residence Timeline: 000 (ignored)
- Employment Timeline: 000 (ignored)

## Features

- **Compact Format**: 16-character string
- **Human Readable**: Easy to understand and share
- **Extensible**: Version bit for future updates
- **Language Support**: Multiple language options
- **Flexible Requirements**: Configurable consents and steps
- **Timeline Control**: Adjustable history periods

## Getting Started

1. Review the [Key Structure](docs/key-structure.md) document
2. Check the [Usage Examples](docs/usage-examples.md) for common scenarios
3. Implement validation using the [Technical Implementation](docs/technical-implementation.md) guide
4. Test your implementation against the [Validation Rules](docs/validation-rules.md)

## Contributing

Contributions to the KeyMaker specification are welcome. Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This specification is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:
1. Check the documentation
2. Open an issue
3. Contact the maintainers

## Version History

- v1.0.0 (2024-03-21)
  - Initial specification release
  - Basic key structure
  - Core validation rules
  - Implementation examples 