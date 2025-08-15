import { roundToTwoDecimals, type Operation } from "../domain/operation.ts";
import { CreatePortfolio, type PortfolioState } from "../domain/portfolio-state.ts";
import type { OperationsBookkeeper } from "../ports/operations-booking-use-case.ts";
import { IsTaxFree } from "./tax-calculator.service.ts";


/**
 * Update the Portfolio State given a new buy operation
 *
 * @param state the current portfolio state
 * @param operation the operation to be used for updating the portfolio quantity and price
 * @returns An updated PortfolioState
 */
const bookBuyOperation = (state: PortfolioState, operation: Operation): PortfolioState => {
    const updatedQuantity = state.quantity + operation.quantity;
    const updatedWeightedAveragePrice = roundToTwoDecimals(((state.quantity * state.weightedAveragePrice) + (operation.quantity * operation["unit-cost"])) / updatedQuantity)

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

    if (operationNetResult <= 0 || IsTaxFree(grossOperationProfit)) {
        let newLosses = operationNetResult <= 0
            ? state.losses + Math.abs(operationNetResult)
            : state.losses;

        return {
            ...state,
            lastOperationProfit: roundToTwoDecimals(grossOperationProfit),
            quantity: newQuantity,
            losses: roundToTwoDecimals(newLosses),
        }
    }

    const netProfit = roundToTwoDecimals(Math.max(0, operationNetResult - state.losses));
    const remainingLoss = roundToTwoDecimals(Math.max(0, state.losses - operationNetResult));

    return {
        ...state,
        lastOperationProfit: grossOperationProfit,
        netProfit,
        losses: remainingLoss,
        quantity: newQuantity,
    }
}

const bookOperation = (state: PortfolioState, operation: Operation): PortfolioState =>
    operation.operation === "buy" ?
        bookBuyOperation(state, operation)
        : bookSellOperation(state, operation)


export const CreateOperationsBookkeeper = (): OperationsBookkeeper => ({
    state: CreatePortfolio(),
    bookOperation: bookOperation
})
