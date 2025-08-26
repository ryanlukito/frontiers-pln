"use client"

import React, {useState} from "react";
import Link from "next/link";
import { BsFillBox2Fill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
// import { IoMdRadioButtonOn } from "react-icons/io";
import AddLocation from "./AddLocation";
import AddTitikLokasi from "./AddTitikLokasi";

const AddElementModal = () => {

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTitikLokasiModal, setShowTitikLokasiModal] = useState(false);

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        <span className="font-bold">Tambah</span> Elemen Baru
      </h1>

      <div className="flex items-center justify-evenly gap-4 flex-wrap">
        <Link
          href="/AddNewItemPage"
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Item Baru"
        >
          <BsFillBox2Fill className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Item Baru</span>
        </Link>

        <button
          onClick={() => setShowLocationModal(true)}
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Lokasi Baru"
        >
          <FaLocationDot className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Lokasi Baru</span>
        </button>

        <button
          onClick={() => setShowTitikLokasiModal(true)}
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Lokasi Baru"
        >
          <FaLocationDot className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Lokasi Baru</span>
        </button>

        {/* <Link
          href="/"
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Titik Lokasi Baru"
        >
          <IoMdRadioButtonOn className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Titik Lokasi Baru</span>
        </Link> */}
      </div>

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
            >
              ✖
            </button>
            <AddLocation />
          </div>
        </div>
      )}

      {showTitikLokasiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setShowTitikLokasiModal(false)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800"
            >
              ✖
            </button>
            <AddTitikLokasi />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddElementModal;
