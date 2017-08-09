/**
 * @file Pivot class with methods
*/
import { tableCreator, fixDataFormat } from './logic';
import { collapse, expand } from './progressiveDiscovery.js';
import { createUniqueValues, filter } from './filtering.js';

export default class Pivot {

  /**
   * instantiates the Pivot class
   * @param {Array<Array|Object>} data
   * @param {Array<string>} rows Rows to pivot on
   * @param {Array<string>} cols Cols to pivot on
   * @param {string} agg Aggregation category
   * @param {string} type Aggregation type, enumerated value
   * @param {string} header Table header (displayed at hte top left)
   * @returns {Object} instantiated pivot object
  */
  constructor(data, rows, cols, agg, type, header) {
    if (!data) this.originalData = {};
    else {
      data = fixDataFormat(data, rows);
      this.originalArgs = {data, rows, cols, agg, type, header};
      this.originalData = tableCreator(data, rows, cols, agg, type, header);
      this.uniqueValues = createUniqueValues(data);
    }

    this.data = this.originalData;
    this.collapsedRows = {};
  }

  /**
   * Creates a new pivot object based on the new arguments
   * @param {Array<Array|Object>} data
   * @param {Array<string>} rows Rows to pivot on
   * @param {Array<string>} cols Cols to pivot on
   * @param {string} agg Aggregation category
   * @param {string} type Aggregation type, enumerated value
   * @param {string} header Table header (displayed at hte top left)
   * @param {boolean} isFiltering If the method is being called by the filter method
   * @returns {Object} instantiated pivot object
  */
  update(data, rows, cols, agg, type, header, isFiltering) {
    data = fixDataFormat(data, rows);
    /** if update isn't being used by filter, need to reset the original arguments */
    if (!isFiltering) {
      this.originalArgs = {data, rows, cols, agg, type, header};
      this.uniqueValues = createUniqueValues(data);
    }

    this.originalData = tableCreator(data, rows, cols, agg, type, header);
    this.data = this.originalData;
    this.originalArgs.data = data;
    this.collapsedRows = {};

    return this;
  }

  /**
   * Collapses the given header row
   * @param {number} rowNum The header row to collapse
   * @returns {Object} pivot object
  */
  collapse(rowNum) {
    const returnedData = collapse(rowNum, this.data);

    if (returnedData.collapsed) {
      this.collapsedRows[this.data.table[rowNum].row] = returnedData.collapsed;
    }
    this.data = returnedData.uncollapsed;

    return this;
  }

  /**
   * Expands the given header row
   * @param {number} rowNum The header row to expand
   * @returns {Object} pivot object
  */
  expand(rowNum) {
    this.data = expand(
      rowNum,
      this.data,
      this.collapsedRows[this.data.table[rowNum].row],
    );
    delete this.collapsedRows[this.data.table[rowNum].row];

    return this;
  }

  /**
   * Toggles the given header row
   * @param {number} rowNum The header row to toggle the collapsed/expanded state
   * @returns {Object} pivot object
  */
  toggle(rowNum) {
    if (this.data.table[rowNum].row in this.collapsedRows) this.expand(rowNum);
    else this.collapse(rowNum);

    return this;
  }

  /**
   * Returns the data for a selected row
   * @param {number} rowNum
   * @returns {Object} the data for a selected row
  */
  getData(rowNum) {
    if (!this.data.table[rowNum]) return null;
    if (this.collapsedRows[this.data.table[rowNum].row]) {
      return this.collapsedRows[this.data.table[rowNum].row].rawData;
    }

    return this.originalData.rawData[this.data.table[rowNum].row];
  }

  /**
   * Gets all the unique values for a given field name
   * @param {string} fieldName
   * @returns {!Array<string>}
  */
  getUniqueValues(fieldName) {
    /** if the field name does not exist, return empty []*/
    if (this.uniqueValues[fieldName]) {
      /** uniqueValues stores unique values in an object so it can be quickly constructed */
      return Object.keys(this.uniqueValues[fieldName]);
    }

    return [];
  }

  /**
   * Filters the data based on provided parameters
   * @param {string|function} fieldName Either the field to filter on or a callback function
   * @param {Array<string>} filterValues Values in field to filter
   * @param {?string} filterType Enumerated string either 'include' or 'exclude'
   * @returns {Object} Returns the pivot object so it is chainable
  */
  filter(fieldName, filterValues, filterType) {
    /** check that the parameters are of allowed type */
    if ((typeof fieldName === 'function') ||
      (typeof fieldName === 'string' && Array.isArray(filterValues))) {
      /** filter out the data set based on the parameters*/
      const filteredData =
        filter(this.originalArgs.data, fieldName, filterValues, filterType);
      /** collect the original arguments provided */
      const {rows, cols, agg, type, header} = this.originalArgs;

      /**
       * get the current rows that are collapsed in reverse because we
       * will recollapse them from bottom to top to ensure nested collapses
       * note: can't use numbered rows unfortunately because when we filter
       * the data, the row numbers will change
      */
      const collapsedRowKeys = Object.keys(this.collapsedRows).reverse();
      const collapsedRows = collapsedRowKeys.map((num) => {
        return this.originalData.table[num].value[0];
      });

      /** update the pivot table with the new filtered data */
      this.update(filteredData, rows, cols, agg, type, header, true);

      /**
       * set a pointer to end of table length
       * doing this rather than rebuilding an array for efficiency
       * also so we don't need to reloop through entire data array
       * since we know that the filters should be in order
      */
      let pointer = this.data.table.length - 1;

      /**
       * loop through each of the collapsed row names
       * if the header row matches the collapsed row, then we need to collapse it
      */
      collapsedRows.forEach((rowValue) => {
        while (pointer >= 0) {
          if ((this.data.table[pointer].type === 'rowHeader') &&
            (rowValue === this.data.table[pointer].value[0])) {
            this.collapse(pointer);
            break;
          }
          pointer -= 1;
        }
      });
    }

    return this;
  }

}
