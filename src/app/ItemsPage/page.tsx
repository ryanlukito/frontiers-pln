"use client";

import React, { useState } from "react";
import { tableContent } from "../../../data/dummy";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import Navbar from "../../components/Navbar";
import Searchbar from "../../components/Searchbar";
import AddElement from "../../components/AddElement";
import AddElementModal from "../../components/AddElementModal";
import QRCodeModal from "@/components/QRCodeModal";
import DetailModal from "@/components/DetailModal";
import { TableItem } from "@/types/utils";

const ItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TableItem | null>(null);

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

  const handleModal = (
    type: "qr" | "detail",
    item: TableItem | null = null,
    open: boolean = false
  ) => {
    if (type === "qr") {
      setIsQrModalOpen(open);
    } else {
      setIsDetailModalOpen(open);
    }
    setSelectedItem(open ? item : null);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white text-black overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Inspection Element
        </h1>

        {/* Search and Add Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Searchbar value={searchTerm} onChange={handleSearch} />
          <AddElement onClick={() => setIsAddModalOpen(true)} />
        </div>

        {/* Data Table */}
        <Table
          tableContent={currentData}
          onOpenQrModal={(item) => handleModal("qr", item, true)}
          onOpenDetailModal={(item) => handleModal("detail", item, true)}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#08333C] text-white rounded hover:bg-[#0a4c57] disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#08333C] text-white rounded hover:bg-[#0a4c57] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {/* Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-3 right-4 text-red-600 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <AddElementModal />
          </div>
        </div>
      )}

      {isQrModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <QRCodeModal
            item={selectedItem}
            onClose={() => handleModal("qr", null, false)}
          />
        </div>
      )}

      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <DetailModal
            item={selectedItem}
            onClose={() => handleModal("detail", null, false)}
          />
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
