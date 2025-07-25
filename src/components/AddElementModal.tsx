import React from "react";
import Link from "next/link";
import { BsFillBox2Fill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdRadioButtonOn } from "react-icons/io";

const AddElementModal = () => {
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

        <Link
          href="/"
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Lokasi Baru"
        >
          <FaLocationDot className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Lokasi Baru</span>
        </Link>

        <Link
          href="/"
          className="flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          aria-label="Tambah Titik Lokasi Baru"
        >
          <IoMdRadioButtonOn className="p-5 bg-[#32A38C] rounded-full text-white text-7xl mb-2" />
          <span className="text-lg font-medium">Titik Lokasi Baru</span>
        </Link>
      </div>
    </div>
  );
};

export default AddElementModal;
