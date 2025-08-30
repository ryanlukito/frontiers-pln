import React from "react";
import { IoMdClose } from "react-icons/io";
import { TableItem } from "@/types/utils";

interface DetailModalProps {
  item: TableItem;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        {/* Header */}
        <div className="mb-6 border-b pb-3 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Detail Informasi
          </h2>
          <button className="text-sm text-blue-600 hover:underline font-medium">
            View Image
          </button>
        </div>

        {/* Item Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <DetailRow label="Nomor Seri" value={item?.nomor_seri} />
          <DetailRow label="Lokasi" value={item?.lokasi} />
          <DetailRow label="Titik Lokasi" value={item?.titik_lokasi} />
          <DetailRow label="Spesifikasi" value={item?.spesifikasi} />
          <DetailRow
            label="Tanggal Pembelian"
            value={
              item?.tanggal_pembelian
                ? new Date(item.tanggal_pembelian).toLocaleDateString("id-ID")
                : "-"
            }
          />
          <DetailRow label="Pemasok" value={item?.pemasok} />
          <DetailRow label="PIC" value={item?.pic} />
          <DetailRow label="Status" value={item?.status} />
        </div>

        {/* Description Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Deskripsi
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {item?.deskripsi || "Tidak ada deskripsi."}
          </p>
        </div>
      </div>
    </div>
  );
};

// Small reusable row component for cleaner code
const DetailRow = ({ label, value }: { label: string; value?: string }) => (
  <p>
    <span className="font-medium text-gray-700">{label}:</span>{" "}
    <span className="text-gray-800">{value || "-"}</span>
  </p>
);

export default DetailModal;
