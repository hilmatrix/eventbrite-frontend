"use client";

export default function Pagination({ currentPage, onPageChange }) {
  const handlePageChange = (page) => {
    if (page > 0) onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-300 rounded mr-2"
      >
        Previous
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  );
}
