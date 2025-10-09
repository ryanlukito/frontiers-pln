"use client";

import React from "react";
import { TableProps } from "../types/utils";
import toast from "react-hot-toast";

const TableAdmin: React.FC<TableProps> = ({
  tableContent,
}) => {
  // console.log("ini table content", tableContent)

  // const handleUpdateStatus = async(id_item: number, newStatus: "APPROVED" | "REJECTED") => {
  //   try {
  //     const res = await fetch(`/api/admin-approval/${id_item}/status`, {
  //       method: "PATCH",
  //       headers: {"Content-Type": "application/json"},
  //       body: JSON.stringify({newStatus}),
  //     });

  //     const data = await res.json();
  //     // console.log("id item", id_item);
  //     // console.log(data);

  //     if (res.ok) {
  //       // console.log("Status updated:", data.item);
  //       toast.success(`Status for item ${data.item.id_item} updated!`)
  //     } else {
  //       toast.error(`Status for item ${data.item.id_item} not updated!`)
  //       console.error("Failed to update:", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error updating item:", error);
  //   }
  // }

  const handleUpdateStatus = async (
  id_item: number,
  newStatus: "APPROVED" | "REJECTED"
  ) => {
    const patchPromise = fetch(`/api/admin-approval/${id_item}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStatus }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Gagal memperbarui item #${id_item}`);
        }
        return data;
      });

    await toast.promise(patchPromise, {
      loading: `⏳ Updating status for item #${id_item}...`,
      success: (data) => `✅ Status for item #${data.item.id_item} updated!`,
      error: (err) => `❌ ${err.message || "Failed to update status"}`,
    });
  };

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
            <th className="px-4 py-3">Pemasok</th>
            <th className="px-4 py-3">PIC</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Uploaded By</th>
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
              <td className="px-4 py-2">{item.pemasok}</td>
              <td className="px-4 py-2">{item.pic}</td>
              <td className="px-4 py-2">{item.status === true ? "Terpasang" : "Tidak Terpasang"}</td>
              <td className="px-4 py-2">{item.uploadedBy}</td>
              <td className="px-4 py-2 flex justify-center gap-2">
                <button
                onClick={() => handleUpdateStatus(item.id_item, "APPROVED")}
                  className="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-xs"
                >
                  Approve
                </button>
                <button
                onClick={() => handleUpdateStatus(item.id_item, "REJECTED")}
                  className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition text-xs"
                >
                  Deny
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableAdmin;
