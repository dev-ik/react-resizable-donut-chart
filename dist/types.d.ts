import { FC } from 'react';

declare const MOVE_DIRECTION: {
    readonly up: "up";
    readonly down: "down";
};

type PieDataItemType = {
    value: number;
    color: string;
    selected: boolean;
    resizing: boolean;
} & {
    [key: string]: unknown;
};
type PieDataType = Array<PieDataItemType>;
type ChangePieDataType = {
    data: PieDataType;
    selectedId?: number;
    isDonutResize?: boolean;
    resizingValue?: number | null;
    moveDirection?: keyof typeof MOVE_DIRECTION | undefined;
};
type DonutInterface = {
    pieData: PieDataType;
    changePieData: ({ data, selectedId, isDonutResize, resizingValue, moveDirection, }: ChangePieDataType) => void;
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

declare const DonutResizableChart: FC<DonutInterface>;

export { type ChangePieDataType, type DonutInterface, DonutResizableChart, type PieDataItemType, type PieDataType };
