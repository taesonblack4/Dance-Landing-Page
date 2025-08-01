import React from 'react'

const SearchBar = ({value , onChange}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        />
    </div>
  )
}

export default SearchBar
