export type Operation = {
    readonly "operation": "buy" | "sell";
    readonly "unit-cost": number;
    readonly "quantity": number;
};
