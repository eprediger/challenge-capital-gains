import { roundToTwoDecimals, type Operation } from "../domain/operation.ts";
import type { Tax } from "../domain/tax.ts";
import type { OperationsBookkeeper } from "../ports/operations-booking-use-case.ts";
import type { TaxCalculatorUseCase } from "../ports/tax-calculator-use-case.ts";
import { CreateOperationsBookkeeper } from "./operations-bookkeeping.service.ts";


const calculateOperationTax = (operation: Operation, bookkeeper: OperationsBookkeeper): Tax => {
    const TAX_RATE: number = 0.2 as const;
    const TAXABLE_MINIMUM: number = 20_000 as const;
    bookkeeper.bookOperation(operation, TAXABLE_MINIMUM)

    if (bookkeeper.portfolio.getLastOperationProfit() <= 0 || operation.isTaxFree(TAXABLE_MINIMUM)) {
        return { tax: 0 }
    } else {
        return { tax: roundToTwoDecimals(bookkeeper.portfolio.getNetProfit() * TAX_RATE) }
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

export const CreateTaxCalculator = (): TaxCalculatorUseCase =>
    (operations: readonly Operation[]): readonly Tax[] => {
        const operationsBookkeeper = CreateOperationsBookkeeper();
        return calculateTaxes(operations, operationsBookkeeper)
    }
