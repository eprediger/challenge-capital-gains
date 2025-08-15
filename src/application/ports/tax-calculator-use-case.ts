import type { Operation } from "../domain/operation.ts";
import type { Tax } from "../domain/tax.ts";

export type TaxCalculatorUseCase = (operations: readonly Operation[]) => readonly Tax[]
