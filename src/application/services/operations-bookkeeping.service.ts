import { type Operation } from "../domain/operation.ts";
import { CreatePortfolio } from "../domain/portfolio-state.ts";
import type { OperationsBookkeeper } from "../ports/operations-booking-use-case.ts";


export const CreateOperationsBookkeeper = (): OperationsBookkeeper => {
    let portfolio = CreatePortfolio()
    return {
        portfolio,
        bookOperation: (operation: Operation, taxThreshold: number) => portfolio.book(operation, taxThreshold)
    }
}
