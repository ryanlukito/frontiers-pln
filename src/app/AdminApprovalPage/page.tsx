"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import TableAdmin from "../../components/TableAdmin";
import Navbar from "../../components/Navbar";
import Searchbar from "../../components/Searchbar";
import { TableItem, ApiItem } from "@/types/utils";

const AdminApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredData = items.filter((item) =>
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin-approval");
        const data = await res.json();
        // console.log("data dari be", data)

        if (data.success) {
          const mapped: TableItem[] = data.items.map(
            (item: ApiItem, index: number) => ({
              no: String(index + 1),
              id_item: item.id_item,
              nama_item: item.nama_item,
              jenis_sarana: item.jenis_sarana,
              nomor_seri: item.nomor_seri,
              lokasi: item.nama_lokasi,
              titik_lokasi: item.titik_lokasi,
              spesifikasi: item.spesifikasi,
              tanggal_pembelian: item.tanggal_pembelian,
              pemasok: item.pemasok,
              pic: item.PIC,
              status: item.status_pemasangan,
              deskripsi: item.deskripsi
            })
          );
          setItems(mapped)
          // console.log("mapped", mapped)
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white text-black overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Admin Approval
        </h1>

        {/* Search and Add Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <Searchbar value={searchTerm} onChange={handleSearch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64 gap-x-5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#08333C] border-solid"></div>
            <p className="text-lg">Loading Data...</p>
          </div>
        ) : currentData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No data available.
          </p>
        ) : (
          <>
            {/* Data Table */}
            <TableAdmin
              tableContent={currentData}
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
          </>
        )}
      </main>
    </div>
  );
};

export default AdminApproval;
