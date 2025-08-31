"use client";

import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { TableItem } from "@/types/utils";
import Link from "next/link";
import QRCode from "./QRCode";
import { useReactToPrint } from "react-to-print";

interface QRCodeModalProps {
  item: TableItem;
  onClose: () => void;
}

const PrintableModal = React.forwardRef<HTMLDivElement, QRCodeModalProps>(
  ({ item, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-2xl p-6 flex flex-col relative shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        {/* Header */}
        <h2 className="mb-6 text-lg font-semibold text-center text-blue-600">
          QR Code
        </h2>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          {/* QR Code Section */}
          <div className="w-44 h-44 flex items-center justify-center border rounded-xl shadow-md bg-gray-50">
            <QRCode id={item.id_item} />
          </div>

          {/* Item Details Section */}
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-inner w-full">
            <Image
              src="/frontiers.png"
              alt="logo frontiers"
              width={80}
              height={80}
              className="rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold">{item?.nama_item}</h1>
              <h2 className="text-sm text-gray-500">S/N: {item?.nomor_seri}</h2>
              <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                This item is registered under{" "}
                <span className="font-medium">Frontiers</span>. Use the QR code
                for quick inspection access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableModal.displayName = "PrintableModal";

const QRCodeModal: React.FC<QRCodeModalProps> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: modalRef,
    documentTitle: `${item?.nama_item || "QRCode"}-modal`,
    onAfterPrint: () => console.log("✅ Print finished"),
  });

  return (
    <div className="flex flex-col items-center">
      {/* Modal */}
      <PrintableModal ref={modalRef} item={item} onClose={onClose} />

      {/* Action Buttons - Now centered below modal */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <button
          onClick={handlePrint}
          className="px-6 py-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition"
        >
          Export to PDF
        </button>

        <Link
          href={`/DetailInspeksiPage/${item?.id_item}`}
          className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition text-center"
        >
          Inspection Details
        </Link>

        <Link
          href={`/InspectionHistoryPage/${item?.id_item}`}
          className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-center"
        >
          Form Inspeksi
        </Link>
      </div>
    </div>
  );
};

export default QRCodeModal;
