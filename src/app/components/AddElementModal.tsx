import React from "react";
import Link from "next/link";
import { BsFillBox2Fill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdRadioButtonOn } from "react-icons/io";

const AddElementModal = () => {
  return (
    <div className="w-[75%] h-[70%]">
      <h1>
        <span className="font-bold">Tambah</span> Elemen Baru
      </h1>
      <div className="flex items-center justify-between">
        <Link href="/" className="">
          <BsFillBox2Fill className="p-5 bg-[#32A38C]" />
          <h1>Item Baru</h1>
        </Link>
        <Link href="/" className="">
          <FaLocationDot className="p-5 bg-[#32A38C]" />
          <h1>Lokasi Baru</h1>
        </Link>
        <Link href="/" className="">
          <IoMdRadioButtonOn className="p-5 bg-[#32A38C]" />
          <h1>Titik Lokasi Baru</h1>
        </Link>
      </div>
    </div>
  );
};

export default AddElementModal;
