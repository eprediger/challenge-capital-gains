import type { Operation } from "../domain/operation.ts";
import type { Portfolio } from "../domain/portfolio-state.ts";

export type OperationsBookkeeper = {
    portfolio: Portfolio;
    bookOperation: (operation: Operation, taxThreshold: number) => void;
};
