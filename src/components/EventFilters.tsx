"use client";

import { useState } from "react";
export default function EventFilters({ onFilterChange  }) {
  const [filters, setFilters] = useState({ category: "", location: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4">
      <select name="category" onChange={handleChange} className="border p-2 rounded">
        <option value="">Category</option>
        <option value="music">Music</option>
        <option value="sports">Sports</option>
        <option value="art">Art</option>
      </select>
      <input
        type="text"
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="border p-2 rounded"
      />
    </div>
  );
}
