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
import { BarchartProps } from "@/types/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Barchart: React.FC<BarchartProps> = ({location}) => {
  
  const locationData: Record<string, number[]> = {
    Banjarmasin: [12, 19, 3, 5],
    Yogyakarta: [8, 15, 10, 12],
    Jakarta: [20, 5, 7, 14],
  }

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green"],
    datasets: [
      {
        label: "Votes",
        data: locationData[location] || [0,0,0,0],
        backgroundColor: ["#f87171", "#60a5fa", "#facc15", "#34d399"],
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Data untuk ${location}` },
    },
  };

  return (
    <div className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Barchart;
