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
