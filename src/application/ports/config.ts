import type { Operation } from "../domain/operation.ts"
import type { Tax } from "../domain/tax.ts"
import type { TaxCalculatorUseCase } from "./tax-calculator-use-case.ts"

export type OperationParser = (input: string) => readonly Operation[]

export type TaxFormatter = (results: readonly Tax[]) => string

export type InputReader = () => Promise<readonly string[]>

export type OutputWriter = (output: string) => Promise<void>

export type Config = {
    readonly useCase: TaxCalculatorUseCase
    readonly parser: OperationParser
    readonly formatter: TaxFormatter
    readonly inputReader: InputReader
    readonly outputWriter: OutputWriter
}

export type Application = {
    readonly run: () => Promise<void>
    readonly processInput: (input: string) => readonly string[]
}
