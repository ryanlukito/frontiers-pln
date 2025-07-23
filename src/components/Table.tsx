"use client";

import React from "react";
import { TableItem, TableProps } from "../types/utils";

interface UpdatedTableProps extends TableProps {
  onOpenQrModal: (item: TableItem) => void;
}

const Table: React.FC<UpdatedTableProps> = ({
  tableContent,
  onOpenQrModal,
}) => {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-4 py-2">No</th>
          <th className="border px-4 py-2">Nama Item</th>
          <th className="border px-4 py-2">Jenis Sarana</th>
          <th className="border px-4 py-2">Nomor Seri</th>
          <th className="border px-4 py-2">Lokasi</th>
          <th className="border px-4 py-2">Titik Lokasi</th>
          <th className="border px-4 py-2">Spesifikasi</th>
          <th className="border px-4 py-2">Tanggal Pembelian</th>
          <th className="border px-4 py-2">Pemasok</th>
          <th className="border px-4 py-2">PIC</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {tableContent.map((item, index) => (
          <tr key={index}>
            <td className="border px-4 py-2">{item.no}</td>
            <td className="border px-4 py-2">{item.nama_item}</td>
            <td className="border px-4 py-2">{item.jenis_sarana}</td>
            <td className="border px-4 py-2">{item.nomor_seri}</td>
            <td className="border px-4 py-2">{item.lokasi}</td>
            <td className="border px-4 py-2">{item.titik_lokasi}</td>
            <td className="border px-4 py-2">{item.spesifikasi}</td>
            <td className="border px-4 py-2">{item.tanggal_pembelian}</td>
            <td className="border px-4 py-2">{item.pemasok}</td>
            <td className="border px-4 py-2">{item.pic}</td>
            <td className="border px-4 py-2">{item.status}</td>
            <td className="border px-4 py-2">
              <button
                onClick={() => onOpenQrModal(item)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                QR
              </button>
              <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                Detail
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
