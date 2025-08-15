export type PortfolioState = {
    readonly lastOperationProfit: number;
    readonly losses: number;
    readonly netProfit: number;
    readonly quantity: number;
    readonly weightedAveragePrice: number;
};

// Initial empty portfolio state
export const CreatePortfolio = (): PortfolioState => ({
    lastOperationProfit: 0,
    losses: 0,
    netProfit: 0,
    quantity: 0,
    weightedAveragePrice: 0,
}) as const;
