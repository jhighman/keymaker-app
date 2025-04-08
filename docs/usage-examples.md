# Usage Examples

## Overview

This document provides practical examples of how to use KeyMaker keys in various scenarios. Each example includes the key, its breakdown, and a description of what it represents.

## Basic Examples

### Minimal Background Check
```
Key: en1000000000000
```
**Breakdown:**
- Language: English (en)
- Initial Bit: 1
- Consents: None (000)
- Steps: None (0000)
- Residence Timeline: 000 (ignored)
- Employment Timeline: 000 (ignored)

**Use Case:**
- Basic identity verification only
- No additional checks required
- Minimal compliance requirements

### Full Background Check
```
Key: en1111111111111
```
**Breakdown:**
- Language: English (en)
- Initial Bit: 1
- Consents: All (111)
  - Driver's License
  - Drug Test
  - Biometric Data
- Steps: All (1111)
  - Education
  - Professional License
  - Residence History
  - Employment History
- Residence Timeline: 111 (20 years)
- Employment Timeline: 111 (20 years)

**Use Case:**
- Comprehensive background check
- Maximum security requirements
- High-risk positions

## Industry-Specific Examples

### Healthcare Position
```
Key: en1111011111111
```
**Breakdown:**
- Language: English (en)
- Initial Bit: 1
- Consents: All (111)
  - Driver's License
  - Drug Test
  - Biometric Data
- Steps: All except Education (1111)
  - Education
  - Professional License
  - Residence History
  - Employment History
- Residence Timeline: 111 (20 years)
- Employment Timeline: 111 (20 years)

**Use Case:**
- Healthcare professional positions
- Requires extensive verification
- Compliance with healthcare regulations

### Financial Services
```
Key: en1111101010101
```
**Breakdown:**
- Language: English (en)
- Initial Bit: 1
- Consents: All (111)
  - Driver's License
  - Drug Test
  - Biometric Data
- Steps: All (1111)
  - Education
  - Professional License
  - Residence History
  - Employment History
- Residence Timeline: 101 (10 years)
- Employment Timeline: 010 (3 years)

**Use Case:**
- Financial services positions
- Focus on recent employment history
- Extended residence verification

### Education Sector
```
Key: en1011000000000
```
**Breakdown:**
- Language: English (en)
- Initial Bit: 1
- Consents: Driver's License only (100)
- Steps: Education and Professional License (1100)
- Residence Timeline: 000 (ignored)
- Employment Timeline: 000 (ignored)

**Use Case:**
- Educational institution positions
- Focus on academic credentials
- Basic identity verification

## Language-Specific Examples

### Spanish Language Check
```
Key: es1111111111111
```
**Breakdown:**
- Language: Spanish (es)
- Initial Bit: 1
- Consents: All (111)
- Steps: All (1111)
- Residence Timeline: 111 (20 years)
- Employment Timeline: 111 (20 years)

**Use Case:**
- Spanish-speaking positions
- Full background check
- International operations

### French Language Check
```
Key: fr1010101010101
```
**Breakdown:**
- Language: French (fr)
- Initial Bit: 1
- Consents: Driver's License only (100)
- Steps: Education and Residence History (1010)
- Residence Timeline: 101 (10 years)
- Employment Timeline: 010 (3 years)

**Use Case:**
- French-speaking positions
- Moderate verification requirements
- International operations

## Implementation Tips

1. **Key Generation**
   - Use a key generator tool
   - Validate keys before use
   - Store keys securely

2. **Key Usage**
   - Include keys in job postings
   - Share with background check providers
   - Document key usage

3. **Key Management**
   - Version control keys
   - Track key usage
   - Maintain key history

4. **Compliance**
   - Ensure keys meet regulatory requirements
   - Document compliance decisions
   - Regular key review 