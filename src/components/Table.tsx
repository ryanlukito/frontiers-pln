"use client";

import React from "react";
import { TableItem, TableProps } from "../types/utils";

interface UpdatedTableProps extends TableProps {
  onOpenQrModal: (item: TableItem) => void;
  onOpenDetailModal: (item: TableItem) => void;
}

const Table: React.FC<UpdatedTableProps> = ({
  tableContent,
  onOpenQrModal,
  onOpenDetailModal,
}) => {
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
            <th className="px-4 py-3">Tanggal Kedaluwarsa</th>
            <th className="px-4 py-3">Berat</th>
            <th className="px-4 py-3">Jenis APAP</th>
            <th className="px-4 py-3">Pemasok</th>
            <th className="px-4 py-3">PIC</th>
            <th className="px-4 py-3">Status</th>
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
              <td className="px-4 py-2">{item.tanggal_kedaluwarsa ? item.tanggal_kedaluwarsa : "-"}</td>
              <td className="px-4 py-2">{item.berat ? item.berat : "-"}</td>
              <td className="px-4 py-2">{item.jenis_apap ? item.jenis_apap : "-"}</td>
              <td className="px-4 py-2">{item.pemasok}</td>
              <td className="px-4 py-2">{item.pic}</td>
              <td className="px-4 py-2">{item.status ? item.status : "-"}</td>
              <td className="px-4 py-2 flex justify-center gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
