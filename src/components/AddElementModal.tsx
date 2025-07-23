import React from "react";
import Link from "next/link";
import { BsFillBox2Fill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdRadioButtonOn } from "react-icons/io";

const AddElementModal = () => {
  return (
    <div className="w-full h-full">
      <h1>
        <span className="font-bold">Tambah</span> Elemen Baru
      </h1>
      <div className="flex items-center justify-evenly">
        <Link href="/" className=" flex flex-col items-center justify-center">
          <BsFillBox2Fill className="p-5 bg-[#32A38C] text-white text-9xl" />
          <h1>Item Baru</h1>
        </Link>
        <Link href="/" className=" flex flex-col items-center justify-center">
          <FaLocationDot className="p-5 bg-[#32A38C] text-white text-9xl" />
          <h1>Lokasi Baru</h1>
        </Link>
        <Link href="/" className=" flex flex-col items-center justify-center">
          <IoMdRadioButtonOn className="p-5 bg-[#32A38C] text-white text-9xl" />
          <h1>Titik Lokasi Baru</h1>
        </Link>
      </div>
    </div>
  );
};

export default AddElementModal;
