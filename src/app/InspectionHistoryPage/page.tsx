"use client";

import React from "react";
import Dropdown from "../../components/Dropdown";

const InspectionHistoryPage = () => {
  const handleSubmit = () => {
    console.log("data");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white text-black p-3">
      <h1 className="p-3 rounded-md drop-shadow-2xl">
        Inspeksi Alat Pemadam Api Portabel{" "}
      </h1>
      <p>Formulir Inspeksi Alat Pemadam Api</p>
      <div className="w-[90%] flex flex-col items-center">
        <div className="w-[80%] h-1 bg-black"></div>
        <div className="w-full flex items-center justify-evenly">
          <h1>Elemen</h1>
          <h1>Status Inspeksi</h1>
        </div>
        <div className="w-[80%] h-1 bg-black"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col items-center mt-3"
      >
        <div className="w-full flex flex-row items-center justify-evenly gap-x-2">
          <h1>ABC</h1>
          <Dropdown
            value={"Pilih Titik Lokasi"}
            onChange={(e) => console.log(e)}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          ></Dropdown>
        </div>
        <button className="hover:cursor-pointer p-3 bg-[#51B5DD] rounded-full text-white">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default InspectionHistoryPage;
