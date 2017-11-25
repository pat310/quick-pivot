## [v2.4.0]
> Nov 24, 2017

- Adding an aggregated column to the `data.table` object that aggregates all data in each row using the selected aggregation function [PR #67](https://github.com/pat310/quick-pivot/pull/67)

## [v2.3.0]
> Nov 9, 2017

- Adding an aggregated row to the `data.table` object that aggregates all previous data rows using the selected aggregation function [PR #62](https://github.com/pat310/quick-pivot/pull/62)

## [v2.2.7]
> Aug 10, 2017

- Fixing webpack config to actually use babel runtime

## [v2.2.6]
> Aug 9, 2017

- Somehow did not build minified version prior to last publish...

## [v2.2.5]
> Aug 8, 2017

- Sorting on multiple keys rather than just a stringified version of the data object

## [v2.2.4]
> Aug 7, 2017

- Fixed bug when pivoting on rows that are empty strings
- Sorting JSON stringified version of data prior to performing any pivoting logic

## [v2.2.3]
> Jul 14, 2017

- Removing `babel-polyfill` from webpack entry and replacing it with `babel-runtime`. [If you’re writing a module you intend to be consumed by other projects, never use the polyfill. Since you won’t control the entirety of the context in which you’ll be executing, you cannot guarantee there won’t be multiple versions of various polyfills. Better to play it safe and have all your ES2015 methods and objects be namespaced by babel-runtime.](https://medium.com/@jcse/clearing-up-the-babel-6-ecosystem-c7678a314bf3)

## [v2.2.2]
> Jun 25, 2017

- Allows for progressive filtering (i.e. newly applied filters do not erase old filters)

[#54]: https://github.com/pat310/quick-pivot/pull/54

## [v2.2.1]
> Apr 18, 2017

- Providing an error message if pivot dimensions are not of type array
- Correctly filtering out all data (returns an empty array rather than creating an error)
- `getUniqueValues` method now returns all the unique values on the original data set, even when values are filtered out

[#47]: https://github.com/pat310/quick-pivot/pull/47
[#49]: https://github.com/pat310/quick-pivot/pull/49
[#51]: https://github.com/pat310/quick-pivot/pull/51

## [v2.2.0]
> Mar 25, 2017

- No longer adds `undefined` as a collapsed row
- Adding the following methods to the `Pivot` class
  - `filter`
  - `getUniqueValues`

[#38]: https://github.com/pat310/quick-pivot/pull/38
[#39]: https://github.com/pat310/quick-pivot/pull/39

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
