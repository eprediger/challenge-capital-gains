import type { Operation } from "./operation.ts";

type PortfolioData = {
    readonly lastGrossOperationProfit: number;
    readonly losses: number;
    readonly netProfit: number;
    readonly quantity: number;
    readonly weightedAveragePrice: number;
};

export type Portfolio = {
    /**
     * Update the Portfolio State based on the given operation
     *
     * @param operation the operation to be used for updating the portfolio quantity and price
     * @returns An updated Portfolio
     */
    book: (operation: Operation, taxThreshold: number) => void;
    getWeightedAveragePrice: () => number;
    getQuantity: () => number;
    getLosses: () => number;
    getOperationNetResult: (operation: Operation) => number;
    getLastOperationProfit: () => number;
    getNetProfit: () => number;
}

export type PortfolioUpdate = Partial<PortfolioData>;

// Initial empty portfolio state
export const CreatePortfolio = (): Portfolio => {
    let data: PortfolioData = {
        lastGrossOperationProfit: 0,
        losses: 0,
        netProfit: 0,
        quantity: 0,
        weightedAveragePrice: 0,
    }

    const self: Portfolio = {
        book: (operation: Operation, taxThreshold: number) => {
            const updatedPortfolio = operation.updatePortfolio(self, taxThreshold)
            data = {
                ...data,
                ...updatedPortfolio
            };
        },
        getWeightedAveragePrice: (): number => data.weightedAveragePrice,
        getOperationNetResult: (operation: Operation): number => operation.getGrossProfit() - data.weightedAveragePrice * operation.getQuantity(),
        getQuantity: (): number => data.quantity,
        getLosses: (): number => data.losses,
        getLastOperationProfit: (): number => data.lastGrossOperationProfit,
        getNetProfit: (): number => data.netProfit,
    };

    return self
};
