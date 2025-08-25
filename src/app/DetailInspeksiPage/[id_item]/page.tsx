"use client";

import React, { useEffect, useState, use } from "react";
import { InspeksiData, Params } from "@/types/utils";
import { formatColumnName } from "@/types/utils";

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
          throw new Error(errData.error || errData.message || "Gagal fetchData");
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_item) {
      fetchInspeksi();
    }
  }, [id_item]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p className="text-red-500">Data tidak ditemukan</p>;

  return (
    <div className="p-4 overflow-x-auto text-black">
      <h1 className="text-xl font-bold mb-6">
        Detail Inspeksi untuk Item #{id_item}
      </h1>

      {Object.entries(data).map(([tableName, records]) => {
        if (records.length === 0) return null;

        // ambil kolom dari keys record pertama
        const columns = Object.keys(records[0]);

        return (
          <div key={tableName} className="mb-8">
            <h2 className="text-white text-lg font-semibold mb-2 capitalize">{formatColumnName(tableName)}</h2>
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 border-b border-gray-300 font-medium"
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
    </div>
  );
};

export default DetailInspeksiPage;
