"use client";

import React, { useState, useEffect } from "react";
import { TableItem } from "@/types/utils";

interface EditElementModalProps {
  item: TableItem;
  onClose: () => void;
  onSave: (updatedItem: TableItem) => void;
}

const EditElementModal: React.FC<EditElementModalProps> = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState<TableItem>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-red-600 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Element</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nama_item"
            value={formData.nama_item}
            onChange={handleChange}
            placeholder="Nama Item"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="nomor_seri"
            value={formData.nomor_seri}
            onChange={handleChange}
            placeholder="Nomor Seri"
            className="border p-2 rounded"
          />
          <textarea
            name="deskripsi"
            value={formData.deskripsi || ""}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="border p-2 rounded"
          />
          {/* You can add more fields as needed */}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#08333C] text-white rounded hover:bg-[#0a4c57]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditElementModal;
