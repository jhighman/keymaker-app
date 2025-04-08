# Consent Options

## Overview

The KeyMaker specification includes three consent options that can be required as part of the background check process. These consents are encoded in three bits of the key.

## Consent Structure

The consent bits are located at positions 3-5 in the key:
```
[Language Code (2)][Initial Bit (1)][Consents (3)][Rest of Key...]
```

## Available Consents

### 1. Driver's License (Bit 3)
- Position: 3
- Purpose: Consent to verify driver's license information
- When enabled (1):
  - Driver's license verification required
  - License history check
  - Traffic violation history
- When disabled (0):
  - No driver's license verification required

### 2. Drug Test (Bit 4)
- Position: 4
- Purpose: Consent to undergo drug testing
- When enabled (1):
  - Drug screening required
  - May include multiple test types
  - Follow-up testing may be required
- When disabled (0):
  - No drug testing required

### 3. Biometric Data (Bit 5)
- Position: 5
- Purpose: Consent to provide biometric information
- When enabled (1):
  - Fingerprint collection required
  - Biometric data storage consent
  - Identity verification
- When disabled (0):
  - No biometric data collection required

## Examples

### No Consents Required
```
en1000000000000
```
Breaking down the consent bits (000):
- Driver's License: 0 (not required)
- Drug Test: 0 (not required)
- Biometric Data: 0 (not required)

### All Consents Required
```
en1110000000000
```
Breaking down the consent bits (111):
- Driver's License: 1 (required)
- Drug Test: 1 (required)
- Biometric Data: 1 (required)

### Partial Consents
```
en1010000000000
```
Breaking down the consent bits (101):
- Driver's License: 1 (required)
- Drug Test: 0 (not required)
- Biometric Data: 1 (required)

## Implementation Notes

1. Consent bits must be either 0 or 1
2. Each consent is independent
3. Consents can be combined in any combination
4. All consents must be obtained before proceeding with the background check
5. Consent forms should be provided in the specified language
6. Consent status should be clearly communicated to the applicant 