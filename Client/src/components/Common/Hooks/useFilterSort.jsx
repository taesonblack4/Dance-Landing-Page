import { useState, useMemo } from 'react';
import Fuse from 'fuse.js'; // fuzzy searching

/**
 * useFilterSort Hook
 * -------------------
 * Filters, searches, and sorts a dataset based on:
 * - selected filters (exact match)
 * - fuzzy search across fields (partial match, typo-tolerant)
 * - dynamic date field sorting
 *
 * @param {Array} data - Raw data array (users, posts, etc).
 * @param {Array} filterFields - Field names for filtering (e.g., ['type', 'location']).
 * @param {Array} searchFields - Field names for fuzzy searching (e.g., ['name', 'location']).
 * @param {String} sortField - Optional field to sort by (e.g. 'created_at', 'creationDate').
 * @param {String} defaultSort - Either 'asc' or 'desc' for date sorting.
 *
 * @returns {{
 *   filteredData: Array,        // Data after filtering, searching, & sorting
 *   filters: Object,            // Current filter values per field
 *   setFilters: Function,       // Update filters
 *   sortDirection: string,      // Current sort direction
 *   setSortDirection: Function, // Toggle sort direction
 *   searchQuery: string,        // Current search string
 *   setSearchQuery: Function    // Set search string
 * }}
 */
export default function useFilterSort(
  data,
  filterFields = [],
  searchFields = [],
  sortField,                  // optional explicit field
  defaultSort = 'desc'        // default direction
) {
  // 1️⃣ FILTER STATE (exact match filtering by dropdowns or inputs)
  const [filters, setFilters] = useState(
    filterFields.reduce((obj, field) => ({ ...obj, [field]: '' }), {})
  );

  // 2️⃣ SORT DIRECTION STATE (used to toggle "newest/oldest" button)
  const [sortDirection, setSortDirection] = useState(defaultSort);

  // 3️⃣ SEARCH STATE (user typing in search input)
  const [searchQuery, setSearchQuery] = useState('');

  // 4️⃣ DETECT SORT FIELD if not explicitly passed
  const detectedSortField = useMemo(() => {
    if (sortField) return sortField;
    if (!data.length) return null;
    const sample = data[0];
    return (
      Object.keys(sample).find(key => {
        const val = sample[key];
        return (
          val instanceof Date ||
          /date$|_at$|_time$/i.test(key)
        );
      }) || null
    );
  }, [data, sortField]);

  // 5️⃣ FILTER + SEARCH + SORT
  const filteredData = useMemo(() => {
    let result = [...data];

    // 🔍 ➕ APPLY FILTERS (dropdown/exact matches)
    result = result.filter(item =>
      filterFields.every(field => {
        const fVal = filters[field];
        if (!fVal) return true;
        const iVal = item[field];
        if (Array.isArray(iVal)) return iVal.includes(fVal);
        return String(iVal).toLowerCase() === fVal.toLowerCase();
      })
    );

    // 🔍 ➕ APPLY FUZZY SEARCH if query and fields exist
    if (searchQuery && searchFields.length) {
      const fuse = new Fuse(result, {
        keys: searchFields,
        threshold: 0.4,        // How fuzzy the match can be
        ignoreLocation: true, // Match anywhere in string
      });
      const fuseResults = fuse.search(searchQuery);
      result = fuseResults.map(res => res.item); // only return matched items
    }

    // 🔢 APPLY SORT if valid date field is found
    if (detectedSortField) {
      result.sort((a, b) => {
        const aVal = a[detectedSortField];
        const bVal = b[detectedSortField];
        const da = aVal ? new Date(aVal) : null;
        const db = bVal ? new Date(bVal) : null;
        if (!da || !db || isNaN(da) || isNaN(db)) return 0;
        return sortDirection === 'asc' ? da - db : db - da;
      });
    }

    return result;
  }, [data, filters, searchQuery, sortDirection, detectedSortField, filterFields, searchFields]);

  return {
    filteredData,
    filters,
    setFilters,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery
  };
}
