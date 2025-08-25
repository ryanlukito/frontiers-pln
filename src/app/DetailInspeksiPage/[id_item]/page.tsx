"use client";

import React, { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import { InspeksiData, Params, formatColumnName } from "@/types/utils";

const DetailInspeksiPage = ({ params }: { params: Promise<Params> }) => {
  const { id_item } = use(params) as Params;
  const [data, setData] = useState<InspeksiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInspeksi = async () => {
      try {
        const res = await fetch(`/api/history-inspeksi/${id_item}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || errData.message || "Gagal fetch data");
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    if (id_item) {
      fetchInspeksi();
    }
  }, [id_item]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;
  if (!data) return <p className="p-6 text-center text-red-500">Data tidak ditemukan</p>;

  return (
    <div className="w-screen min-h-screen flex flex-col bg-white text-black overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Detail Inspeksi untuk Item #{id_item}
        </h1>

        {Object.entries(data).map(([tableName, records]) => {
          if (records.length === 0) return null;

          const columns = Object.keys(records[0]);

          return (
            <div
              key={tableName}
              className="bg-white border rounded-xl shadow-sm p-4 overflow-x-auto"
            >
              <h2 className="text-lg font-semibold mb-3 capitalize text-gray-800">
                {formatColumnName(tableName)}
              </h2>
              <table className="min-w-full border border-gray-300 text-sm text-left rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 border-b border-gray-300 font-medium text-gray-700"
                      >
                        {formatColumnName(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-3 py-2 border-b border-gray-200 text-gray-700"
                        >
                          {String(record[col] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default DetailInspeksiPage;
