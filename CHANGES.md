## [v2.2.0]
> XXXX, 2017

- No longer adds `undefined` as a collapsed row

[#38]: https://github.com/pat310/quick-pivot/pull/38

## [v2.1.1]
> Mar 12, 2017

- Fixes bug in toggle function

[#35]: https://github.com/pat310/quick-pivot/pull/35

## [v2.1.0]
> Mar 11, 2017

- Adding the following aggregation types
  - `average`
  - `min`
  - `max`
- Adding a `.toggle` method to toggle a row to collapsed if expanded or vice-versa

[#30]: https://github.com/pat310/quick-pivot/pull/30
[#31]: https://github.com/pat310/quick-pivot/pull/31

## [v2.0.0]
> Feb 5, 2017

- Changing to es6 class structure with the following methods:
  - `.update` - updates existing data
  - `.collapse` - collapses data into a header row
  - `.expand` - expands a collapsed row
  - `.getData` - returns the data within a collapsed row

[#18]: https://github.com/pat310/quick-pivot/pull/18