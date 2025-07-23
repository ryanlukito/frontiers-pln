"use client";

import React, { useState } from "react";
import { tableContent } from "../../../data/dummy";
import Pagination from "../components/Pagination";
import Table from "../components/Table";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import AddElement from "../components/AddElement";
import AddElementModal from "../components/AddElementModal";

const ItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsOpenModal] = useState(false);

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

  const toggleModal = () => setIsOpenModal(!isModalOpen);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar />
      <div className="p-4 w-full max-w-5xl flex flex-col items-center">
        <div>
          <h1>Inspection Element</h1>
          <div className="flex items-center justify-between w-full mb-3">
            <Searchbar value={searchTerm} onChange={handleSearch} />
            <AddElement onClick={toggleModal} />
          </div>
          <Table tableContent={currentData} />
        </div>

        <div className="flex justify-between mt-4 w-full items-center">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 hover:bg-gray-400 disabled:opacity-50 rounded hover:cursor-pointer text-white bg-[#08333C] hover:text-black"
          >
            Previous
          </button>
          <span className="text-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#08333C] hover:bg-gray-400 disabled:opacity-50 rounded hover:cursor-pointer text-white hover:text-black"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[80%] h-[70%]">
            <button
              onClick={toggleModal}
              className="text-right w-full text-red-600 font-bold mb-4"
            >
              X
            </button>
            <AddElementModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
