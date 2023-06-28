import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`inline-block mx-1 px-3 py-2 rounded-lg cursor-pointer ${
            currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <ul className="pagination flex justify-center mt-4">
      {renderPageNumbers()}
    </ul>
  );
}

export default Pagination;