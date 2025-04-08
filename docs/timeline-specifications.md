# Timeline Specifications

## Overview

The KeyMaker specification includes timeline requirements for both residence and employment history verification. These timelines are encoded in three bits each, located at positions 10-12 (residence) and 13-15 (employment) in the key.

## Timeline Structure

The timeline bits are located at positions 10-15 in the key:
```
[Language Code (2)][Initial Bit (1)][Consents (3)][Steps (4)][Residence Timeline (3)][Employment Timeline (3)]
```

## Available Timeline Options

### Residence Timeline (Bits 10-12)
- Only applicable when Residence History step is enabled
- Three bits allow for 8 possible values (000-111)
- Valid values:
  - 000: 1 year
  - 001: 2 years
  - 010: 3 years
  - 011: 5 years
  - 100: 7 years
  - 101: 10 years
  - 110: 15 years
  - 111: 20 years

### Employment Timeline (Bits 13-15)
- Only applicable when Employment History step is enabled
- Three bits allow for 8 possible values (000-111)
- Valid values:
  - 000: 1 year
  - 001: 2 years
  - 010: 3 years
  - 011: 5 years
  - 100: 7 years
  - 101: 10 years
  - 110: 15 years
  - 111: 20 years

## Examples

### Residence History Only
```
en1000100000000
```
Breaking down the timeline bits:
- Residence Timeline: 010 (3 years)
- Employment Timeline: 000 (ignored as Employment History is not enabled)

### Employment History Only
```
en1000010000000
```
Breaking down the timeline bits:
- Residence Timeline: 000 (ignored as Residence History is not enabled)
- Employment Timeline: 001 (2 years)

### Both Histories Required
```
en1111101000000
```
Breaking down the timeline bits:
- Residence Timeline: 101 (10 years)
- Employment Timeline: 010 (3 years)

## Implementation Notes

1. Timeline bits must be valid values (000-111)
2. Timeline specifications are only considered when their respective steps are enabled
3. Timeline bits are ignored when their respective steps are disabled
4. Timeline periods are calculated from the current date
5. Gaps in history should be documented
6. Timeline requirements should be clearly communicated to applicants
7. Verification should cover the entire specified period
8. Multiple addresses/employers within the timeline should be verified 