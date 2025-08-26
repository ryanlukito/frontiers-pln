"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { RekapJenis } from "@/types/utils";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarchartProps {
  jenis: string;   // <-- dipilih dari dropdown
  bulan: number;
  tahun: number;
}

const Barchart: React.FC<BarchartProps> = ({ jenis, bulan, tahun }) => {
  const [jenisData, setJenisData] = useState<RekapJenis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRekap = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rekapitulasi?bulan=${bulan}&tahun=${tahun}`);
        const data = await res.json();
        setJenisData(data.per_jenis || []);
      } catch (err) {
        console.error("Error fetching rekap: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRekap();
  }, [bulan, tahun]);

  if (loading) return <p>Loading chart...</p>;

  const selected = jenisData.find((j) => j.jenis_sarana === jenis);

  if (!selected) {
    return <p className="italic text-gray-500">Silakan pilih jenis sarana</p>;
  }

  const labels = ["Siap", "Minor", "Mayor", "Belum"];
  const datasetData = [
    selected.siap,
    selected.minor,
    selected.mayor,
    selected.belum,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: `Status ${jenis}`,
        data: datasetData,
        backgroundColor: ["#34d399", "#facc15", "#f87171", "#9ca3af"],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Kesiapan ${jenis}` },
    },
  };

  return (
    <div className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Barchart;
