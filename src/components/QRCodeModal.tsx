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
      <button className="mb-4 px-6 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
        Generate QR Code
      </button>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center justify-evenly w-full gap-6">
        <div className="w-48 h-48 flex items-center justify-center">
          {/* <span className="text-gray-500">QR Code Placeholder</span> */}
          <QRCode id={item.id_item}/>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Image
            src="/frontiers.png"
            alt="logo frontiers"
            width={120}
            height={120}
            className="rounded-md"
          />
          <h1>
            <span className="font-medium">Name:</span> {item?.nama_item}
          </h1>
          <h1>
            <span className="font-medium">S/N:</span> {item?.nomor_seri}
          </h1>
          <h1 className="mt-2 text-gray-600">
            Scan for inspection and more details
          </h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleExportPDF} className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition">
          
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
