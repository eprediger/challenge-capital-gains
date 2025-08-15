import {
    bookOperation
} from "./portfolio-bookkeeper.ts";
import { type PortfolioState } from "./application/domain/portfolio-state.ts";
import { type Operation } from "./application/domain/operation.ts";
import type { Tax } from "./application/domain/tax.ts";

const INITIAL_PORTFOLIO_STATE: PortfolioState = {
    lastOperationProfit: 0,
    losses: 0,
    netProfit: 0,
    quantity: 0,
    weightedAveragePrice: 0,
};

export const isTaxFree = (amount: number): boolean => {
    const TAXABLE_MINIMUM: number = 20_000 as const;

    return amount <= TAXABLE_MINIMUM
}

const sellOperationTax = (state: PortfolioState, nextState: PortfolioState): number => {
    const TAX_RATE: number = 0.2 as const;

    if (nextState.losses > state.losses || isTaxFree(nextState.lastOperationProfit)) {
        return 0;
    }

    return nextState.netProfit * TAX_RATE;
}


const calculateOperationTax = (state: PortfolioState, operation: Operation): [PortfolioState, Tax] => {
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
