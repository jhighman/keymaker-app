# KeyMaker Specification Documentation

This documentation describes the KeyMaker specification, a standardized format for encoding background check configuration settings.

## Overview

The KeyMaker specification defines a compact, binary-based encoding system for representing background check configuration settings. This specification enables the creation of human-readable keys that encode various consent options, required verification steps, and timeline requirements.

## Table of Contents

1. [Executive Overview](./executive-overview.md)
2. [Key Structure](./key-structure.md)
3. [Language Codes](./language-codes.md)
4. [Consent Options](./consent-options.md)
5. [Verification Steps](./verification-steps.md)
6. [Timeline Requirements](./timeline-requirements.md)
7. [Implementation Guide](./implementation-guide.md)
8. [Examples](./examples.md)
9. [Architecture](./architecture.md)
10. [Components](./components.md)
11. [Use Cases](./use-cases.md)
12. [Invite](./invite.md)
13. [Future Requirements](./future-requirements.md)
14. [Sequence Diagrams](./sequence-diagrams.md)
15. [API Contract](./api-contract.md)
16. [UI Mockups](./ui-mockups.md)

## Quick Reference

A KeyMaker key follows this structure:
```
[Language Code (2 chars)][Initial Bit (1)][Consents (3 bits)][Steps (4 bits)][Residence Timeline (3 bits)][Employment Timeline (3 bits)]
```

Total length: 16 characters
- Language code: 2 characters
- Binary data: 14 characters (1 + 3 + 4 + 3 + 3)

## Usage

The KeyMaker specification is designed to be:
- Human-readable
- Compact
- Self-contained
- Easy to validate
- Easy to parse

## Version

Current version: 1.0.0

## License

This specification is open source and available under the MIT License. 