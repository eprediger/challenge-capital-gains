import { CreateOperation, type Operation, type OperationType } from "../../application/domain/operation.ts"
import type { OperationParser } from "../../application/ports/config.ts"

type OperationInput = {
    operation: OperationType,
    ["unit-cost"]: number,
    quantity: number,
}

export const CreateOperationParser = (): OperationParser =>
    (input: string): readonly Operation[] => {
        const parsed = JSON.parse(input.trim())

        return parsed.map((op: OperationInput): Operation => CreateOperation(
            op.operation, op["unit-cost"], op.quantity
        ))
    }
