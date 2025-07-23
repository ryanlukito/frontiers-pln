export type RadialProgressChartProps = {
  percentage: number;
};

export interface DropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | boolean | number }[];
}

export interface TableItem {
  no: string;
  nama_item: string;
  jenis_sarana: string;
  nomor_seri: string;
  lokasi: string;
  titik_lokasi: string;
  spesifikasi: string;
  tanggal_pembelian: string;
  pemasok: string;
  pic: string;
  status: string;
}

export interface TableProps {
  tableContent: TableItem[];
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
  installationStatus: "terpasang" | "belum_terpasang";
  file: File | null;
}

export interface InputFieldProps {
  name: keyof FormData;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

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

export type PaginationReturn = {
  currentData: TableItem[];
  currentPage: number;
  totalPages: number;
  goToNext: () => void;
  goToPrevious: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
