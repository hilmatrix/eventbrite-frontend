"use client";

import { useState, useEffect } from "react";

export default function SearchBar({ onSearch: onSearch }: { onSearch: (query: string) => void }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(input);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [input]);

  return (
    <input
      type="text"
      placeholder="Search events..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="border rounded p-2 w-full"
    />
  );
}
