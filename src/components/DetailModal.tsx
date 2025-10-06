import React from "react";
import { IoMdClose } from "react-icons/io";
import { TableItem } from "@/types/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DetailModalProps {
  item: TableItem;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-y-auto p-8"
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-white bg-gray-700/60 hover:bg-red-500 transition p-2 rounded-full"
            onClick={onClose}
          >
            <IoMdClose size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 border-b pt-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Detail Informasi
            </h2>

            {item?.gambar ? (
              <a
                href={item.gambar}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium p-2 text-white bg-blue-500 rounded-sm"
              >
                View Image
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
                View Image
              </span>
            )}
          </div>

          {/* Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
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
          {item?.deskripsi && (
            <div className="mt-8 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {item.deskripsi}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Small reusable row component
const DetailRow = ({
  label,
  value,
  }: {
    label: string;
    value?: string | boolean | number;
  }) => (
    <p className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-gray-800 font-medium">{value?.toString() || "-"}</span>
    </p>
  );

export default DetailModal;
