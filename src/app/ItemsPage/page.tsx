"use client";

import React, { useState } from "react";
import { tableContent } from "../../../data/dummy";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Navbar from "@/components/Navbar";
import Searchbar from "@/components/Searchbar";

const ItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = tableContent.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const {
    currentData,
    currentPage,
    totalPages,
    goToNext,
    goToPrevious,
    setCurrentPage,
  } = Pagination(filteredData, 5);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar />
      <div className="p-4 w-full max-w-4xl flex flex-col items-center">
        <div>
          <h1>Inventory Table</h1>
          <Searchbar value={searchTerm} onChange={handleSearch} />
          <Table tableContent={currentData} />
        </div>

        <div className="flex justify-between mt-4 w-full">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded hover:cursor-pointer"
          >
            Previous
          </button>
          <span className="text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded hover:cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsPage;
