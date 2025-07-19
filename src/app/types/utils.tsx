export type RadialProgressChartProps = {
  percentage: number;
};

export interface DropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string | boolean | number }[];
}
