import React from "react";
import { TableProps } from "../types/utils";

const Table: React.FC<TableProps> = ({ tableContent }) => {
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
