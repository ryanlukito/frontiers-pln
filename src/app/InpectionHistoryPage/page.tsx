"use client";

import React from "react";
import Dropdown from "../components/Dropdown";

const InspectionHistoryPage = () => {
  const handleSubmit = () => {
    console.log("data");
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1>Inspeksi Alat Pemadam Api Portabel </h1>
      <p>Formulir Inspeksi Alat Pemadam Api</p>
      <div>
        <div className="w-[70%] h-2"></div>
        <div className="flex items-center justify-center">
          <h1>Elemen</h1>
          <h1>Status Inspeksi</h1>
        </div>
        <div className="w-[70%] h-2"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <Dropdown
            value={"Pilih Titik Lokasi"}
            onChange={(e) => console.log(e)}
            options={[
              { label: "Yes", value: "Yes" },
              { label: "No", value: "No" },
            ]}
          ></Dropdown>
        </div>
        <button>Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default InspectionHistoryPage;
