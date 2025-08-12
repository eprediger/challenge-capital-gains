// Immutable type representing an operation
export type Operation = {
    readonly "operation": "buy" | "sell";
    readonly "unit-cost": number;
    readonly "quantity": number;
  };
  
// Immutable state representing the current portfolio
type PortfolioState = {
    readonly quantity: number;
    readonly weightedAveragePrice: number;
}

// Initial empty portfolio state
const INITIAL_STATE: PortfolioState = {
    quantity: 0,
    weightedAveragePrice: 0
}

const handleBuy = (state: PortfolioState, buyOperation: Operation): PortfolioState => {
    const updatedQuantity = state.quantity + buyOperation.quantity;
    const updatedWeightedAveragePrice = ((state.quantity * state.weightedAveragePrice) + (buyOperation.quantity * buyOperation["unit-cost"])) / updatedQuantity
    
    return {
        quantity: updatedQuantity,
        weightedAveragePrice: updatedWeightedAveragePrice
    }
}

const handleSell = (state: PortfolioState, operation: Operation): PortfolioState => (
    {
        quantity: state.quantity - operation.quantity,
        weightedAveragePrice: state.weightedAveragePrice
    }
)

const applyOperation = (state: PortfolioState, operation: Operation): PortfolioState =>
    operation.operation === "buy"
    ?
    handleBuy(state, operation)
 : handleSell(state, operation)

export const calculateWeightedAveragePrice = (operations: readonly Operation[]): number =>
    operations
        .reduce(applyOperation, INITIAL_STATE)
        .weightedAveragePrice;

