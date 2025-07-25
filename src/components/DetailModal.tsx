import React from "react";
import { IoMdClose } from "react-icons/io";
import { TableItem } from "@/types/utils";

interface DetailModalProps {
  item: TableItem;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-lg overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Detail Informasi</h2>
          <button className="text-sm text-blue-600 hover:underline">
            View Image
          </button>
        </div>

        {/* Item Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Nomor Seri:</span> {item?.nomor_seri}
          </p>
          <p>
            <span className="font-medium">Lokasi:</span> {item?.lokasi}
          </p>
          <p>
            <span className="font-medium">Titik Lokasi:</span>{" "}
            {item?.titik_lokasi}
          </p>
          <p>
            <span className="font-medium">Spesifikasi:</span>{" "}
            {item?.spesifikasi}
          </p>
          <p>
            <span className="font-medium">Tanggal Pembelian:</span>{" "}
            {item?.tanggal_pembelian}
          </p>
          <p>
            <span className="font-medium">Pemasok:</span> {item?.pemasok}
          </p>
          <p>
            <span className="font-medium">PIC:</span> {item?.pic}
          </p>
          <p>
            <span className="font-medium">Status:</span> {item?.status}
          </p>
          <div>
            <p className="font-medium mb-1">Deskripsi:</p>
            <p className="whitespace-pre-line">
              {item?.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
