import { DateTime } from "next-auth/providers/kakao";

export type RadialProgressChartProps = {
  percentage: number;
};

export interface DropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | boolean | number }[];
  textTemplate: string;
}

export interface TableItem {
  no: string;
  id_item: number;
  nama_item: string;
  jenis_sarana: string;
  nomor_seri: string;
  lokasi: string;
  titik_lokasi: string;
  spesifikasi: string;
  tanggal_pembelian: DateTime;
  tanggal_kedaluwarsa: DateTime;
  berat: number;
  jenis_apap: string;
  pemasok: string;
  pic: string;
  status: string;
  deskripsi: string;
}

export interface TableProps {
  tableContent: TableItem[];
}

export interface ApiItem {
  id_item: string;
  nama_item: string;
  jenis_sarana: string;
  nomor_ser: string;
  nama_lokasi: string;
  titik_lokasi: string;
  spesifikasi: string;
  tanggal_pembelian: string;
  pemasok: string;
  PIC: string;
  status_pemasangan: string;
  deskripsi: string;
}

export interface InspeksiData {
  [key: string]: any[];
}

export interface BarchartProps {
  location: string;
}

export interface FormData {
  itemName: string;
  serialNumber: string;
  locationPoint: string;
  locationId: string;
  specification: string;
  installationDate: string;
  supplier: string;
  pic: string;
  installationStatus: string;
  file: File | null;

  // 🔹 Tambahan untuk APAP
  expiryDate?: string;
  weight?: string;
  purchaseDate?: string;
  apapType?: "GAS_CAIR_NON_HALON" | "POWDER" | "CO2" | "LITHIUM";
}

export interface InputFieldProps {
  name: keyof FormData;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

export interface QRCodeProps {
  id: number;
}

export type InspectionResponse = {
  item: {
    jenis_sarana: string;
    nama_item: string;
  };
  inspeksiTable: string;
  columns: { column_name: string; data_type: string }[];
};

export interface RadioOptionProps {
  name: keyof FormData;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

export interface AddElementProps {
  onClick: () => void;
}

export interface Item {
  id: string;
  nama_item: string;
  nomor_seri: string;
}

export type PaginationReturn = {
  currentData: TableItem[];
  currentPage: number;
  totalPages: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export type Params = {
  id_item: string;
}

export interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type TitikLokasi = {
  id_titik_lokasi: number;
  nama_titik_lokasi: string;
  lokasi_id: number;
};

export type Lokasi = {
  lokasi_id: number;
  nama_lokasi: string;
  titik_lokasi: TitikLokasi[];
};

export function formatColumnName(name: string): string {
  const withSpaces = name.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}