import React from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { TableItem } from "@/types/utils";

interface QRCodeModalProps {
  item: TableItem;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ item, onClose }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <IoMdClose className="absolute right-1 top-1" onClick={onClose} />
      <button>Generate QR Code</button>
      <div className="flex flex-row items-center justify-evenly p-4 border border-blue-500">
        <div>QR Code</div>
        <div className="flex flex-col items-start justify-evenly">
          <Image
            src="/frontiers.png"
            alt="logo frontiers"
            width={1000}
            height={1000}
          />
          <h1>Name: {item?.nama_item}</h1>
          <h1>S/N: {item?.nomor_seri}</h1>
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
