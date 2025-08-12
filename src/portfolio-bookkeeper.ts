// Immutable type representing an operation
export type Operation = {
    readonly "operation": "buy" | "sell";
    readonly "unit-cost": number;
    readonly "quantity": number;
};

// State representing the current portfolio
export type PortfolioState = {
    readonly quantity: number;
    readonly weightedAveragePrice: number;
    readonly operations: Operation[];
    readonly losses: number;
    readonly netProfit: number;
}

// Initial empty portfolio state
const INITIAL_STATE: PortfolioState = {
    losses: 0,
    netProfit: 0,
    quantity: 0,
    weightedAveragePrice: 0,
    operations: [],
}

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
        quantity: updatedQuantity,
        weightedAveragePrice: updatedWeightedAveragePrice,
        operations: [...state.operations, operation]
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
    // const totalSoldAmount = operation.quantity * operation["unit-cost"];
    const operationNetResult = (operation["unit-cost"] - state.weightedAveragePrice) * operation.quantity;
    const newQuantity = state.quantity - operation.quantity;

    // if (operationNetResult < 0) {
    //     const newLosses = state.losses + Math.abs(operationNetResult)

    //     return {
    //         ...state,
    //         quantity: newQuantity,
    //         losses: newLosses,
    //         operations: [...state.operations, operation]
    //     }
    // }

    const netProfit = Math.max(0, operationNetResult - state.losses);
    const remainingLoss = Math.max(0, state.losses - operationNetResult)

    return {
        ...state,
        netProfit,
        losses: remainingLoss,
        quantity: newQuantity,
        operations: [...state.operations, operation]
    }
}

export const bookOperation = (state: PortfolioState, operation: Operation): PortfolioState =>
    operation.operation === "buy" ?
        bookBuyOperation(state, operation)
        : bookSellOperation(state, operation)

export const bookOperations = (operations: readonly Operation[]): PortfolioState =>
    operations
        .reduce(bookOperation, INITIAL_STATE);
