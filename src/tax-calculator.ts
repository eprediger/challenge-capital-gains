import {
    bookOperation,
    type Operation,
    type PortfolioState
} from "./portfolio-bookkeeper.ts";

export type Tax = {
    "tax": number
}

const INITIAL_PORTFOLIO_STATE: PortfolioState = {
    lastOperationProfit: 0,
    losses: 0,
    netProfit: 0,
    quantity: 0,
    weightedAveragePrice: 0,
};


const sellOperationTax = (state: PortfolioState, nextState: PortfolioState): number => {
    const TAX_RATE: number = 0.2 as const;
    const TAXABLE_MINIMUM: number = 20_000 as const;

    if (nextState.losses > state.losses || nextState.lastOperationProfit <= TAXABLE_MINIMUM) {
        return 0;
    }

    return nextState.netProfit * TAX_RATE;
}


function calculateOperationTax(state: PortfolioState, operation: Operation): [PortfolioState, Tax] {
    const newState = bookOperation(state, operation)

    if (operation.operation === "buy") {
        return [newState, { tax: 0 }]
    } else {
        return [newState, { tax: sellOperationTax(state, newState) }]
    }
}

/**
 * Describes how much taxes should be paid for each operation
 *
 * @param operations the operations to calcule the taxes from
 * @returns Tax[] the taxes applied to each operation
 */
export const calculateTaxes = (operations: readonly Operation[]): readonly Tax[] => {
    const taxes: Tax[] = []
    let currentPortfolioState = INITIAL_PORTFOLIO_STATE

    for (const operation of operations) {
        const [newState, taxResult] = calculateOperationTax(currentPortfolioState, operation)
        currentPortfolioState = newState
        taxes.push(taxResult)
    }

    return taxes
}
