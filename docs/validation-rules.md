# Validation Rules

## Overview

This document outlines the validation rules for KeyMaker keys. A valid key must meet all these requirements to be considered properly formatted and usable.

## Key Structure Validation

1. **Length**
   - Must be exactly 16 characters
   - No more, no less

2. **Character Set**
   - Only alphanumeric characters are allowed
   - No special characters or spaces
   - Case sensitive

## Section-Specific Validation

### Language Code (Positions 1-2)
1. Must be a valid ISO 639-1 two-letter language code
2. Currently supported codes:
   - en (English)
   - es (Spanish)
   - fr (French)
3. Must be lowercase

### Initial Bit (Position 3)
1. Must be "1"
2. Reserved for future versioning

### Consent Bits (Positions 4-6)
1. Each bit must be either "0" or "1"
2. No other values allowed
3. Independent of other sections

### Step Bits (Positions 7-10)
1. Each bit must be either "0" or "1"
2. No other values allowed
3. Independent of other sections

### Timeline Bits (Positions 11-16)
1. Each timeline section must be three bits
2. Each bit must be either "0" or "1"
3. Valid combinations:
   - 000 (1 year)
   - 001 (2 years)
   - 010 (3 years)
   - 011 (5 years)
   - 100 (7 years)
   - 101 (10 years)
   - 110 (15 years)
   - 111 (20 years)

## Conditional Validation

1. **Residence Timeline**
   - Only validated if Residence History step is enabled
   - Must be valid timeline code when enabled
   - Ignored when Residence History is disabled

2. **Employment Timeline**
   - Only validated if Employment History step is enabled
   - Must be valid timeline code when enabled
   - Ignored when Employment History is disabled

## Examples

### Valid Keys
```
en1000000000000  # Minimal valid key
es1111111111111  # Maximum valid key
fr1010101010101  # Alternating bits
```

### Invalid Keys
```
en2000000000000  # Invalid initial bit
en100000000000   # Too short
en10000000000000 # Too long
en1x000000000000 # Invalid character
EN1000000000000  # Invalid case
```

## Implementation Guidelines

1. **Validation Order**
   - Check length first
   - Validate character set
   - Verify language code
   - Check initial bit
   - Validate consent bits
   - Validate step bits
   - Check timeline bits based on enabled steps

2. **Error Handling**
   - Provide specific error messages for each validation failure
   - Include position information in error messages
   - Suggest corrections when possible

3. **Performance**
   - Validate early in the process
   - Cache validation results when appropriate
   - Optimize for common validation patterns

4. **Security**
   - Validate before processing
   - Sanitize input
   - Prevent buffer overflow attacks
   - Log validation failures 