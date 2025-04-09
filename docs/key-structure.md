# Key Structure

## Overview

The KeyMaker key is a 16-character string that encodes various configuration settings for background checks. The key is divided into distinct sections, each representing different aspects of the configuration.

## Structure Breakdown

```
[Language Code (2)][Initial Bit (1)][Consents (3)][Steps (4)][Residence Timeline (3)][Employment Timeline (3)]
```

### 1. Language Code (2 characters)
- Position: 0-1
- Format: Two lowercase letters
- Purpose: Specifies the language for the background check process
- Example: "en" for English

### 2. Initial Bit (1 character)
- Position: 2
- Format: Single digit "1"
- Purpose: Version identifier and validation
- Value: Always "1"

### 3. Consents (3 bits)
- Position: 3-5
- Format: Three binary digits (0 or 1)
- Purpose: Specifies which consents are required
- Order:
  1. Driver's License (bit 3)
  2. Drug Test (bit 4)
  3. Biometric Data (bit 5)

### 4. Steps (4 bits)
- Position: 6-9
- Format: Four binary digits (0 or 1)
- Purpose: Specifies which verification steps are required
- Order:
  1. Education (bit 6)
  2. Professional License (bit 7)
  3. Residence History (bit 8)
  4. Employment History (bit 9)

### 5. Residence Timeline (3 bits)
- Position: 10-12
- Format: Three binary digits (0 or 1)
- Purpose: Specifies the required residence history period
- Only used if Residence History is required (bit 8 is 1)
- Values:
  - 000: 1 Entry (0 years)
  - 001: 3 Years
  - 010: 5 Years
  - 011: 7 Years
  - 100: 10 Years

### 6. Employment Timeline (3 bits)
- Position: 13-15
- Format: Three binary digits (0 or 1)
- Purpose: Specifies the required employment history period
- Only used if Employment History is required (bit 9 is 1)
- Values:
  - 000: 1 Entry (0 years)
  - 001: 3 Years
  - 010: 5 Years
  - 011: 7 Years
  - 100: 10 Years

## Examples

### Basic Example

```
en1000000000000
```

Breaking down this example:
- Language: "en" (English)
- Initial Bit: "1"
- Consents: "000" (No consents required)
- Steps: "0000" (No steps required)
- Residence Timeline: "000" (N/A - no residence required)
- Employment Timeline: "000" (N/A - no employment required)

### Comprehensive Example

```
en-EPA-DTB-R5-E3-E-P-W
```

Breaking down this example using the current implementation format:
- Language: "en" (English)
- Personal Info: "EPA" (Email, Phone, Address all required)
- Consents: "DTB" (Drug Test, Tax Forms, Biometric all required)
- Residence History: "R5" (5 years of residence history required)
- Employment History: "E3" (3 years of employment history required)
- Education: "E" (Education verification required)
- Professional License: "P" (Professional license verification required)
- Signature: "W" (Wet signature required)

This format is used in the KeyAnalyzer component and represents the evolved implementation of the key structure.

## Validation Rules

1. Total length must be exactly 16 characters
2. Language code must be a valid two-letter code
3. Initial bit must be "1"
4. All bits after the language code must be either "0" or "1"
5. Timeline codes must be valid when their respective steps are required
6. Timeline codes are ignored when their respective steps are not required 