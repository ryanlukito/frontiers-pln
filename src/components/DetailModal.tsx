import React from "react";
import { IoMdClose } from "react-icons/io";

const DetailModal = () => {
  return (
    <div className="w-full h-full flex flex-col items-start justify-center">
      <div className="w-full flex items-center justify-between">
        <button>View Image</button>
        <IoMdClose />
      </div>
      <h1>Nomor Seri</h1>
      <h1>Lokasi</h1>
      <h1>Titik Lokasi</h1>
      <h1>Spesifikasi</h1>
      <h1>Tanggal Pembelian</h1>
      <h1>Pemasok</h1>
      <h1>PIC</h1>
      <h1>Status</h1>
      <h1>Deskripsi</h1>
    </div>
  );
};

export default DetailModal;
