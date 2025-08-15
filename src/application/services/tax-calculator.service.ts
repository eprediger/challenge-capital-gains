import { roundToTwoDecimals, type Operation } from "../domain/operation.ts";
import type { PortfolioState } from "../domain/portfolio-state.ts";
import type { Tax } from "../domain/tax.ts";
import type { OperationsBookkeeper } from "../ports/operations-booking-use-case.ts";
import type { TaxCalculatorUseCase } from "../ports/tax-calculator-use-case.ts";


export const IsTaxFree = (amount: number): boolean => {
    const TAXABLE_MINIMUM: number = 20_000 as const;

    return amount <= TAXABLE_MINIMUM
}

const sellOperationTax = (state: PortfolioState, nextState: PortfolioState): number => {
    const TAX_RATE: number = 0.2 as const;

    if (nextState.losses > state.losses || IsTaxFree(nextState.lastOperationProfit)) {
        return 0;
    }

    return roundToTwoDecimals(nextState.netProfit * TAX_RATE);
}


const calculateOperationTax = (operation: Operation, bookkeeper: OperationsBookkeeper): Tax => {
    const initialState = bookkeeper.state
    bookkeeper.state = bookkeeper.bookOperation(bookkeeper.state, operation)

    if (operation.operation === "buy") {
        return { tax: 0 }
    } else {
        return { tax: sellOperationTax(initialState, bookkeeper.state) }
    }
}

/**
 * Describes how much taxes should be paid for each operation
 *
 * @param operations the operations to calcule the taxes from
 * @returns Tax[] the taxes applied to each operation
 */
export const calculateTaxes = (operations: readonly Operation[], bookkeeper: OperationsBookkeeper): readonly Tax[] =>
    operations.map(op => calculateOperationTax(op, bookkeeper), [])

export const CreateTaxCalculator = (operationsBookkeeper: OperationsBookkeeper): TaxCalculatorUseCase =>
    (operations: readonly Operation[]): readonly Tax[] =>
        calculateTaxes(operations, operationsBookkeeper)
