import {
    bookOperation,
    type Operation,
    type PortfolioState
} from "./portfolio-bookkeeper.ts";

export type Tax = {
    "tax": number
}

const INITIAL_PORTFOLIO_STATE: PortfolioState = {
    losses: 0,
    netProfit: 0,
    quantity: 0,
    weightedAveragePrice: 0,
    operations: [],
};

const TAX_RATE: number = 0.2 as const;
const NON_TAXABLE_MINIMUM: number = 20_000 as const;

function calculateOperationTax(state: PortfolioState, operation: Operation): [PortfolioState, Tax] {
    const newState = bookOperation(state, operation)

    if (operation.operation === "buy") {
        return [newState, { tax: 0 }]
    } else {
        return [newState, { tax: newState.netProfit * TAX_RATE }]
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
