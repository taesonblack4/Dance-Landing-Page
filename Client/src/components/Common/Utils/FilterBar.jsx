import React from 'react';

const FilterBar = ({ data, filters, setFilters, fieldsToFilter }) => {
  // Extract unique options per filter field
  const getOptions = (field) => {
    const options = new Set();

    data.forEach((item) => {
      const value = item[field];
      if (Array.isArray(value)) {
        value.forEach(v => options.add(v));
      } else if (value) {
        options.add(value);
      }
    });

    return Array.from(options);
  };

  return (
    <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {fieldsToFilter.map((field) => (
        <div key={field}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <select
            value={filters[field] || ''}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [field]: e.target.value || undefined,
              }))
            }
          >
            <option value="">All</option>
            {getOptions(field).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;
