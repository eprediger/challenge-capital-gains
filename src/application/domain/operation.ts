export type Operation = {
    readonly "operation": "buy" | "sell";
    readonly "unit-cost": number;
    readonly "quantity": number;
};

export const roundToTwoDecimals = (value: number): number =>
    Math.round(value * 100) / 100
