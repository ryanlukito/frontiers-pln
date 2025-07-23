import React from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";

const QRCodeModal = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <IoMdClose className="absolute right-1 top-1" />
      <button>Generate QR Code</button>
      <div className="flex flex-row items-center justify-evenly p-4 border border-blue-500">
        <div>QR Code</div>
        <div className="flex flex-col items-start justify-evenly">
          <Image src="/frontiers.png" alt="logo frontiers" />
          <h1>Name</h1>
          <h1>No Seri</h1>
          <h1>Scan For Inspection and More Detail</h1>
        </div>
      </div>
      <div className="flex flex-row items-center justify-evenly">
        <button>Inspection Details</button>
        <button>Form Inspeksi</button>
      </div>
    </div>
  );
};

export default QRCodeModal;
