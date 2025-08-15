import type { Operation } from "../domain/operation.ts";
import type { PortfolioState } from "../domain/portfolio-state.ts";

export type OperationsBookkeeper = {
    state: PortfolioState;
    bookOperation: (state: PortfolioState, operation: Operation) => PortfolioState;
};
