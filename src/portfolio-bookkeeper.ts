import { CreatePortfolio, type PortfolioState } from "./application/domain/portfolio-state.ts";
import type { Operation } from "./application/domain/operation.ts";
import { isTaxFree } from "./tax-calculator.ts";

/**
 * Update the Portfolio State given a new buy operation
 *
 * @param state the current portfolio state
 * @param operation the operation to be used for updating the portfolio quantity and price
 * @returns An updated PortfolioState
 */
const bookBuyOperation = (state: PortfolioState, operation: Operation): PortfolioState => {
    const updatedQuantity = state.quantity + operation.quantity;
    const updatedWeightedAveragePrice = ((state.quantity * state.weightedAveragePrice) + (operation.quantity * operation["unit-cost"])) / updatedQuantity

    return {
        ...state,
        lastOperationProfit: 0,
        quantity: updatedQuantity,
        weightedAveragePrice: updatedWeightedAveragePrice,
    }
}

/**
 * Update the Portfolio State given a new sell operation
 *
 * @param state the current portfolio state
 * @param operation the operation to be used for updating the portfolio quantity and price
 * @returns An updated PortfolioState
 */
const bookSellOperation = (state: PortfolioState, operation: Operation): PortfolioState => {
    const grossOperationProfit = operation.quantity * operation["unit-cost"];
    const operationNetResult = (operation["unit-cost"] - state.weightedAveragePrice) * operation.quantity;
    const newQuantity = state.quantity - operation.quantity;

    if (operationNetResult <= 0 || isTaxFree(grossOperationProfit)) {
        let newLosses = operationNetResult <= 0
            ? state.losses + Math.abs(operationNetResult)
            : state.losses;

        return {
            ...state,
            lastOperationProfit: grossOperationProfit,
            quantity: newQuantity,
            losses: newLosses,
        }
    }

    const netProfit = Math.max(0, operationNetResult - state.losses);
    const remainingLoss = Math.max(0, state.losses - operationNetResult)

    return {
        ...state,
        lastOperationProfit: grossOperationProfit,
        netProfit,
        losses: remainingLoss,
        quantity: newQuantity,
    }
}

export const bookOperation = (state: PortfolioState, operation: Operation): PortfolioState =>
    operation.operation === "buy" ?
        bookBuyOperation(state, operation)
        : bookSellOperation(state, operation)

export const bookOperations = (operations: readonly Operation[]): PortfolioState =>
    operations
        .reduce(bookOperation, CreatePortfolio());
