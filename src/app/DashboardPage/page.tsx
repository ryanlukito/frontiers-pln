"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Barchart from "@/components/Barchart";
import RadialProgressChart from "@/components/RadialProgress";

const DashboardPage = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-white text-black overflow-x-hidden">
      <Navbar></Navbar>
      <div className="w-[80%] h-[85%] flex flex-col items-center justify-center">
        <div className=" w-full flex gap-x-3">
          <div className="w-[50%] p-4 border-2 text-center flex flex-col items-center">
            <RadialProgressChart percentage={79} />
            <h1>
              Persentase{" "}
              <span className="font-bold">
                Kesiapan Alat Secara Keseluruhan
              </span>
            </h1>
          </div>
          <div className="w-[50%] flex flex-col items-center justify-evenly border-2 p-4 relative">
            <div className="w-full flex items-end justify-end mb-3 gap-x-5">
              <button>Refresh</button>
              <button>Save to PDF</button>
            </div>
            <h1>
              Kesiapan Alat{" "}
              <span className="font-bold">berdasarkan Lokasi</span>
            </h1>
            <div>
              <div className="flex flex-row text-center gap-x-3">
                <div className="flex flex-col items-center">
                  <RadialProgressChart percentage={50} />
                  <h1>
                    Persentase{" "}
                    <span className="font-bold">Kesiapan Kota Banjarmasin</span>
                  </h1>
                </div>
                <div className="flex flex-col items-center">
                  <RadialProgressChart percentage={50} />
                  <h1>
                    Persentase{" "}
                    <span className="font-bold">Kesiapan Kota Yogyakarta</span>
                  </h1>
                </div>
              </div>
            </div>
            <button className="italic underline">Lihat Semua</button>
          </div>
        </div>
        <div className="w-[85%] border-2 mt-2 px-4 flex flex-col items-center justify-center">
          <h1>Kesiapan Alat Jenis Sarana</h1>
          <Barchart></Barchart>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
