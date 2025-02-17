import { MOVE_DIRECTION } from './const';

export type PieDataItemType = {
  value: number;
  color: string;
  selected: boolean;
  resizing: boolean;
} & { [key: string]: unknown };

export type PieDataType = Array<PieDataItemType>;

export type ChangePieDataType = {
  data: PieDataType;
  selectedId?: number;
  isDonutResize?: boolean;
  resizingValue?: number | null;
  moveDirection?: keyof typeof MOVE_DIRECTION | undefined;
};

export type DonutInterface = {
  pieData: PieDataType;
  changePieData: ({
    data,
    selectedId,
    isDonutResize,
    resizingValue,
    moveDirection,
  }: ChangePieDataType) => void;
  sizes?: {
    height: number;
    width: number;
    thickness: number;
  };
  cornerRadius?: number | null;
  isNotResizable?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
};
