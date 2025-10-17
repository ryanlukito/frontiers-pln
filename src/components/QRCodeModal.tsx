"use client";

import React, { useRef } from "react";
import { IoMdClose } from "react-icons/io";
// import Image from "next/image";
import { TableItem } from "@/types/utils";
import Link from "next/link";
import QRCode from "./QRCode";
import { useReactToPrint } from "react-to-print";

interface QRCodeModalProps {
  item: TableItem;
  onClose: () => void;
  location?: string; // Optional: Make location dynamic
}

const PrintableModal = React.forwardRef<HTMLDivElement, QRCodeModalProps>(
  ({ item, onClose, location }, ref) => {
    return (
      // This is the modal container, which includes non-printable elements
      <div className="bg-white w-auto max-w-4xl max-h-[90vh] rounded-2xl p-4 flex flex-col relative shadow-2xl overflow-hidden">
        {/* Close Button & Header - Will be hidden during printing */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl z-10 print:hidden"
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        <h2 className="mb-4 text-lg font-semibold text-center text-blue-600 print:hidden">
          Print Preview
        </h2>

        {/* This is the printable area that the ref is attached to */}
        <div ref={ref} className="p-2 bg-white">
          {/* Main card with double border */}
          <div className="border-2 border-black p-1">
            <div className="border border-black p-6">
              {/* Content Area: Two-column layout */}
              <div className="flex items-center justify-between gap-8">
                {/* Left Column */}
                <div className="flex flex-col items-center justify-between h-[320px] w-[240px]">
                  {/* 1. Logo */}
                  <div className="w-40">
                    <img
                      src="/frontiers.png" // Using existing logo path
                      alt="Frontiers Logo"
                      width={160}
                      height={40}
                      // objectFit="contain"
                    />
                  </div>

                  {/* 2. Item Name */}
                  <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-inner py-3 px-6 text-center">
                    <h1 className="text-3xl font-bold tracking-wider text-gray-800">
                      {`${item?.nama_item}-${item?.id_item} `|| "-"}
                    </h1>
                  </div>

                  {/* 3. Scan Me Image */}
                  <div className="text-center">
                    <QRCode id={item.id_item} size={100} />
                  </div>

                  {/* 4. Location Text */}
                  <p className="text-center font-semibold text-gray-800 text-lg">
                    {location || "PLN UP3 BULUNGAN"}
                  </p>
                </div>

                {/* Right Column (Large QR Code) */}
                <div className="w-[320px] h-[320px] flex items-center justify-center">
                  <QRCode id={item.id_item} />
                </div>
              </div>
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
      {/* Modal */}A
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
