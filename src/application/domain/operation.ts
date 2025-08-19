import type { Portfolio, PortfolioUpdate } from "./portfolio-state.ts";

export type OperationType = "buy" | "sell";

export type Operation = {
    isTaxFree: (taxThreshold: number) => boolean;
    updatePortfolio: (portfolio: Portfolio, taxThreshold: number) => PortfolioUpdate;
    getGrossProfit: () => number,
    getUnitCost: () => number,
    getQuantity: () => number,
}

const CreateBuyOperation = (
    unitCost: number,
    quantity: number): Operation => {

    const self: Operation = {
        isTaxFree: (_taxThreshold: number): boolean => true,
        updatePortfolio: (portfolio: Portfolio, _taxThreshold: number): PortfolioUpdate => ({
            quantity: portfolio.getQuantity() + quantity,
            weightedAveragePrice: ((portfolio.getQuantity() * portfolio.getWeightedAveragePrice()) + (quantity * unitCost)) / (portfolio.getQuantity() + quantity),
            lastGrossOperationProfit: 0,
        }),
        getGrossProfit: (): number => 0,
        getUnitCost: (): number => unitCost,
        getQuantity: (): number => quantity
    };
    return self
}

const CreateSellOperation = (
    unitCost: number,
    quantity: number): Operation => {

    const self: Operation = {
        isTaxFree: (taxThreshold: number): boolean => self.getGrossProfit() <= taxThreshold,
        updatePortfolio: (portfolio: Portfolio, taxThreshold: number): PortfolioUpdate => {
            let updatedPortfolio = {
                quantity: portfolio.getQuantity() - quantity
            }
            const portfolioLosses = portfolio.getLosses();
            const grossOperationProfit = self.getGrossProfit();
            const operationNetResult = (unitCost - portfolio.getWeightedAveragePrice()) * quantity;

            if (operationNetResult <= 0) {
                const newLosses = portfolioLosses + Math.abs(operationNetResult);

                return {
                    ...updatedPortfolio,
                    lastGrossOperationProfit: 0,
                    losses: roundToTwoDecimals(newLosses),
                }
            }

            const netProfit = roundToTwoDecimals(Math.max(0, operationNetResult - portfolioLosses));
            const remainingLoss = self.isTaxFree(taxThreshold) ?
                portfolioLosses :
                roundToTwoDecimals(Math.max(0, portfolioLosses - operationNetResult));

            return {
                ...updatedPortfolio,
                lastGrossOperationProfit: grossOperationProfit,
                netProfit,
                losses: remainingLoss,
            }
        },
        getGrossProfit: (): number => quantity * unitCost,
        getUnitCost: (): number => unitCost,
        getQuantity: (): number => -quantity
    };

    return self
}

/**
 * Factory function to create operations
 *
 * @param operation The type of the operation. Must be either "buy" or "sell"
 * @param unitCost The unit cost of financial asset of the operation. Must be positive
 * @param quantity The amount of financial asset of the operation. Must be positive integer
 * @returns Operation
 */
export const CreateOperation = (
    operation: OperationType,
    unitCost: number,
    quantity: number): Operation => {

    switch (operation) {
        case "buy":
            return CreateBuyOperation(unitCost, quantity);
        case "sell":
            return CreateSellOperation(unitCost, quantity);
    }
};

export const roundToTwoDecimals = (value: number): number =>
    Math.round(value * 100) / 100
