"use client";

import React, { useState } from "react";

const AddLocation: React.FC = () => {
  const [namaLokasi, setNamaLokasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/lokasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama_lokasi: namaLokasi }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan lokasi");

      setMessage("✅ Lokasi berhasil ditambahkan!");
      setNamaLokasi("");
    } catch (err: unknown) {
        if (err instanceof Error) {
          setMessage(`❌ ${err.message}`);
        } else {
          setMessage("❌ An unknown error occurred");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80%] flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-800">Tambah Lokasi Baru</h2>

        <div>
          <label htmlFor="namaLokasi" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lokasi
          </label>
          <input
            type="text"
            id="namaLokasi"
            value={namaLokasi}
            onChange={(e) => setNamaLokasi(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama lokasi"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#32A38C] text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Tambah Lokasi"}
        </button>

        {message && (
          <p className="text-sm text-center font-medium mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddLocation;
