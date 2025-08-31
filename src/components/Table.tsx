"use client";

import React from "react";
import { TableItem, TableProps } from "../types/utils";
import {useSession} from "next-auth/react";
import Link from "next/link";

interface UpdatedTableProps extends TableProps {
  onOpenQrModal: (item: TableItem) => void;
  onOpenDetailModal: (item: TableItem) => void;
}

const Table: React.FC<UpdatedTableProps> = ({
  tableContent,
  onOpenQrModal,
  onOpenDetailModal,
}) => {
  const {data: session} = useSession();
  console.log(tableContent);

  return (
    <div className="overflow-x-auto w-full rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3">No</th>
            <th className="px-4 py-3">Nama Item</th>
            <th className="px-4 py-3">Jenis Sarana</th>
            <th className="px-4 py-3">Nomor Seri</th>
            <th className="px-4 py-3">Lokasi</th>
            <th className="px-4 py-3">Titik Lokasi</th>
            <th className="px-4 py-3">Spesifikasi</th>
            <th className="px-4 py-3">Tanggal Pembelian</th>
            <th className="px-4 py-3">Tanggal KAdaluwarsa</th>
            <th className="px-4 py-3">Berat</th>
            <th className="px-4 py-3">Jenis APAP</th>
            <th className="px-4 py-3">Pemasok</th>
            <th className="px-4 py-3">PIC</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Kesiapan Inspeksi</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {tableContent.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
              }
            >
              <td className="px-4 py-2">{item.no}</td>
              <td className="px-4 py-2">{item.nama_item}</td>
              <td className="px-4 py-2">{item.jenis_sarana}</td>
              <td className="px-4 py-2">{item.nomor_seri}</td>
              <td className="px-4 py-2">{item.lokasi}</td>
              <td className="px-4 py-2">{item.titik_lokasi}</td>
              <td className="px-4 py-2">{item.spesifikasi}</td>
              <td className="px-4 py-2">{new Date(item.tanggal_pembelian).toLocaleDateString("id-ID")}</td>
              <td className="px-4 py-2">{item.tanggal_kadaluwarsa ? new Date(item.tanggal_kadaluwarsa).toLocaleDateString("id-ID") : "-"}</td>
              <td className="px-4 py-2">{item.berat ? item.berat : "-"}</td>
              <td className="px-4 py-2">{item.jenis_APAP ? item.jenis_APAP : "-"}</td>
              <td className="px-4 py-2">{item.pemasok}</td>
              <td className="px-4 py-2">{item.pic}</td>
              <td className="px-4 py-2">{item.status === true ? "Terpasang" : "Tidak Terpasang"}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  {/* Circle with group for hover */}
                  <div className="relative group">
                    <span
                      className={`w-3 h-3 rounded-full block ${
                        item.kesiapan === "Siap 100%"
                          ? "bg-green-500"
                          : item.kesiapan === "Belum diperiksa / Rusak / Tidak Siap"
                          ? "bg-red-500"
                          : item.kesiapan === "Mayor Ketidaksiapan"
                          ? "bg-orange-500"
                          : item.kesiapan === "Minor Ketidaksiapan"
                          ? "bg-yellow-400"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {item.kesiapan ? item.kesiapan : "-"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onOpenQrModal(item)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-xs"
                  >
                    QR
                  </button>
                  <button
                    onClick={() => onOpenDetailModal(item)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition text-xs"
                  >
                    Detail
                  </button>
                  {session?.user?.role === "ADMIN" && (
                  <Link
                    href={`/EditItemPage/${item?.id_item}`} 
                    className="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-xs"
                  >
                    Edit
                  </Link>
                  )}
                  {session?.user?.role === "ADMIN" && (
                  <button
                  onClick={async() => {
                    if(confirm(`Yakin ingin menghapus item ${item.nama_item}?`)) {
                      try {
                        const res = await fetch(`/api/items/${item.id_item}`, {
                          method: "DELETE"
                        })
                        if (res.ok) {
                          alert("Item berhasil dihapus");
                          window.location.reload(); // or trigger re-fetch if you use SWR/React Query
                        } else {
                          const err = await res.json();
                          alert(`Gagal menghapus item: ${err.error || "Unknown error"}`);
                        }
                      } catch(error) {
                        console.error("Delete error:", error);
                        alert("Terjadi kesalahan saat menghapus item");
                      }
                    }
                  }}
                    className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-800 transition text-xs"
                  >
                    Delete
                  </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
