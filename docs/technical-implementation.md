# Technical Implementation Guide

## Overview

This document provides technical guidance for implementing the KeyMaker specification in various programming languages and systems. It includes code examples, best practices, and implementation considerations.

## Key Structure

### Bit Positions
```
[1-2]   Language Code (2 chars)
[3]     Initial Bit (1 char)
[4-6]   Consent Bits (3 bits)
[7-10]  Step Bits (4 bits)
[11-13] Residence Timeline (3 bits)
[14-16] Employment Timeline (3 bits)
```

## Implementation Examples

### TypeScript/JavaScript

```typescript
interface KeyMakerKey {
  language: string;
  initialBit: string;
  consents: {
    driversLicense: boolean;
    drugTest: boolean;
    biometricData: boolean;
  };
  steps: {
    education: boolean;
    professionalLicense: boolean;
    residenceHistory: boolean;
    employmentHistory: boolean;
  };
  timelines: {
    residence: number;
    employment: number;
  };
}

class KeyMakerValidator {
  private static readonly TIMELINE_MAP = {
    '000': 1,
    '001': 2,
    '010': 3,
    '011': 5,
    '100': 7,
    '101': 10,
    '110': 15,
    '111': 20
  };

  static validate(key: string): boolean {
    // Length check
    if (key.length !== 16) return false;

    // Character set check
    if (!/^[a-z0-9]+$/.test(key)) return false;

    // Language code check
    const language = key.substring(0, 2);
    if (!['en', 'es', 'fr'].includes(language)) return false;

    // Initial bit check
    if (key[2] !== '1') return false;

    // Consent bits check
    const consentBits = key.substring(3, 6);
    if (!/^[01]{3}$/.test(consentBits)) return false;

    // Step bits check
    const stepBits = key.substring(6, 10);
    if (!/^[01]{4}$/.test(stepBits)) return false;

    // Timeline bits check
    const residenceTimeline = key.substring(10, 13);
    const employmentTimeline = key.substring(13, 16);
    
    if (!this.TIMELINE_MAP[residenceTimeline] || 
        !this.TIMELINE_MAP[employmentTimeline]) {
      return false;
    }

    return true;
  }

  static parse(key: string): KeyMakerKey {
    if (!this.validate(key)) {
      throw new Error('Invalid KeyMaker key');
    }

    return {
      language: key.substring(0, 2),
      initialBit: key[2],
      consents: {
        driversLicense: key[3] === '1',
        drugTest: key[4] === '1',
        biometricData: key[5] === '1'
      },
      steps: {
        education: key[6] === '1',
        professionalLicense: key[7] === '1',
        residenceHistory: key[8] === '1',
        employmentHistory: key[9] === '1'
      },
      timelines: {
        residence: this.TIMELINE_MAP[key.substring(10, 13)],
        employment: this.TIMELINE_MAP[key.substring(13, 16)]
      }
    };
  }
}
```

### Python

```python
from dataclasses import dataclass
from typing import Dict, Optional

@dataclass
class Consents:
    drivers_license: bool
    drug_test: bool
    biometric_data: bool

@dataclass
class Steps:
    education: bool
    professional_license: bool
    residence_history: bool
    employment_history: bool

@dataclass
class Timelines:
    residence: int
    employment: int

@dataclass
class KeyMakerKey:
    language: str
    initial_bit: str
    consents: Consents
    steps: Steps
    timelines: Timelines

class KeyMakerValidator:
    TIMELINE_MAP = {
        '000': 1,
        '001': 2,
        '010': 3,
        '011': 5,
        '100': 7,
        '101': 10,
        '110': 15,
        '111': 20
    }

    @staticmethod
    def validate(key: str) -> bool:
        # Length check
        if len(key) != 16:
            return False

        # Character set check
        if not key.isalnum() or not key.islower():
            return False

        # Language code check
        language = key[:2]
        if language not in ['en', 'es', 'fr']:
            return False

        # Initial bit check
        if key[2] != '1':
            return False

        # Consent bits check
        consent_bits = key[3:6]
        if not all(bit in '01' for bit in consent_bits):
            return False

        # Step bits check
        step_bits = key[6:10]
        if not all(bit in '01' for bit in step_bits):
            return False

        # Timeline bits check
        residence_timeline = key[10:13]
        employment_timeline = key[13:16]

        if (residence_timeline not in KeyMakerValidator.TIMELINE_MAP or
            employment_timeline not in KeyMakerValidator.TIMELINE_MAP):
            return False

        return True

    @staticmethod
    def parse(key: str) -> KeyMakerKey:
        if not KeyMakerValidator.validate(key):
            raise ValueError('Invalid KeyMaker key')

        return KeyMakerKey(
            language=key[:2],
            initial_bit=key[2],
            consents=Consents(
                drivers_license=key[3] == '1',
                drug_test=key[4] == '1',
                biometric_data=key[5] == '1'
            ),
            steps=Steps(
                education=key[6] == '1',
                professional_license=key[7] == '1',
                residence_history=key[8] == '1',
                employment_history=key[9] == '1'
            ),
            timelines=Timelines(
                residence=KeyMakerValidator.TIMELINE_MAP[key[10:13]],
                employment=KeyMakerValidator.TIMELINE_MAP[key[13:16]]
            )
        )
```

## Best Practices

### 1. Validation
- Validate keys before processing
- Implement comprehensive error handling
- Provide clear error messages
- Log validation failures

### 2. Performance
- Cache validation results
- Optimize string operations
- Use efficient data structures
- Implement early returns

### 3. Security
- Sanitize input
- Prevent buffer overflows
- Implement rate limiting
- Log security events

### 4. Testing
- Unit test validation
- Test edge cases
- Test invalid inputs
- Test performance

### 5. Documentation
- Document public APIs
- Include usage examples
- Document error codes
- Maintain changelog

## Integration Guidelines

### 1. API Integration
- Use RESTful endpoints
- Implement proper error handling
- Include authentication
- Rate limit requests

### 2. Database Storage
- Use appropriate data types
- Index frequently queried fields
- Implement data validation
- Regular backups

### 3. Caching
- Cache validation results
- Cache parsed keys
- Implement cache invalidation
- Monitor cache performance

### 4. Monitoring
- Log key usage
- Monitor validation failures
- Track performance metrics
- Alert on errors

## Error Handling

### 1. Validation Errors
```typescript
class KeyMakerError extends Error {
  constructor(
    message: string,
    public code: string,
    public position?: number
  ) {
    super(message);
    this.name = 'KeyMakerError';
  }
}
```

### 2. Error Codes
- INVALID_LENGTH: Key length is not 16 characters
- INVALID_CHARS: Contains invalid characters
- INVALID_LANGUAGE: Invalid language code
- INVALID_INITIAL_BIT: Initial bit is not '1'
- INVALID_CONSENTS: Invalid consent bits
- INVALID_STEPS: Invalid step bits
- INVALID_TIMELINE: Invalid timeline bits

### 3. Error Messages
- Clear and descriptive
- Include position information
- Suggest corrections
- Provide examples 