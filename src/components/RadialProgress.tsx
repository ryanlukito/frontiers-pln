import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RadialProgressChartProps } from "../types/utils";

const RadialProgressChart = ({ percentage }: RadialProgressChartProps) => {
  return (
    <div className="w-[80%] flex items-center justify-center">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={{
          path: {
            stroke: "#08333C", // teal (progress color)
            strokeLinecap: "butt",
            transition: "stroke-dashoffset 0.5s ease 0s",
            transform: "rotate(0.25turn)",
            transformOrigin: "center center",
          },
          trail: {
            stroke: " #2DD4BF", // dark teal (background trail)
            strokeLinecap: "butt",
            transform: "rotate(0.25turn)",
            transformOrigin: "center center",
          },
          text: {
            fill: "#000000", // black text
            fontSize: "20px",
            fontWeight: "bold",
          },
        }}
      />
    </div>
  );
};

export default RadialProgressChart;
