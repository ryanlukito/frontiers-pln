"use client"

import React, {useRef} from "react";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { TableItem } from "@/types/utils";
import Link from "next/link";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "./QRCode";

interface QRCodeModalProps {
  item: TableItem;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ item, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  console.log(item);
  const handleExportPDF = async() => {
    if (!modalRef.current) return;

    const canvas = await html2canvas(modalRef.current, {scale: 2});
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    // const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const position = 10;
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);

    pdf.save(`${item?.nama_item || "QRCode"}-modal.pdf`)
  }

  return (
    <div
      ref={modalRef} 
      className="bg-white w-[90%] max-w-4xl h-[70%] rounded-xl p-6 flex flex-col items-center justify-between relative shadow-xl overflow-auto">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
        onClick={onClose}
      >
        <IoMdClose />
      </button>

      {/* Header */}
      <div className="mb-4 px-6 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
        QR Code
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full max-w-3xl bg-white shadow-md rounded-2xl p-6 gap-8">
        {/* QR Code Section */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 flex items-center justify-center border rounded-xl shadow-sm bg-gray-50">
            <QRCode id={item.id_item} />
          </div>
        </div>

        {/* Item Details Section */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            <Image
              src="/frontiers.png"
              alt="logo frontiers"
              width={100}
              height={100}
              className="rounded-lg shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold">{item?.nama_item}</h1>
              <h2 className="text-sm text-gray-500">S/N: {item?.nomor_seri}</h2>
            </div>
          </div>

          <div className="mt-4 border-t pt-4 text-sm text-gray-600">
            <p className="leading-relaxed">
              This item is registered under <span className="font-medium">Frontiers</span>. 
              Use the QR code for quick inspection access.
            </p>
          </div>
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleExportPDF} className="px-6 py-2 rounded-full bg-yellow-600 text-white hover:bg-green-700 transition">
          Export to PDF
        </button>
        <Link 
          href={`/DetailInspeksiPage/${item?.id_item}`} 
          className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
          Inspection Details
        </Link>
        <Link
          href={`/InspectionHistoryPage/${item?.id_item}`}
          className="px-6 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Form Inspeksi
        </Link>
      </div>
    </div>
  );
};

export default QRCodeModal;
