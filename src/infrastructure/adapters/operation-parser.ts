import type { Operation } from "../../application/domain/operation.ts"
import type { OperationParser } from "../../application/ports/config.ts"

export const CreateOperationParser = (): OperationParser =>
    (input: string): readonly Operation[] => {
        const parsed = JSON.parse(input.trim())
        return parsed.map((op: any): Operation => ({
            operation: op.operation,
            ["unit-cost"]: op["unit-cost"],
            quantity: op.quantity
        }))
    }
