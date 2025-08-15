import assert from "node:assert";
import test, { beforeEach, describe, it } from "node:test";
import { Operation } from "../../../src/application/domain/operation";
import { Tax } from "../../../src/application/domain/tax";
import { OperationsBookkeeper } from "../../../src/application/ports/operations-booking-use-case";
import { CreateOperationsBookkeeper } from "../../../src/application/services/operations-bookkeeping.service";
import { calculateTaxes } from "../../../src/application/services/tax-calculator.service";

type OperationTestCase = {
    operations: Operation[],
    expectedTaxes: Tax[]
}

describe("Tax calculator", () => {
    let operationsBook: OperationsBookkeeper;

    beforeEach(() => {
        operationsBook = CreateOperationsBookkeeper()
    })

    describe("Given a buy operation", () => {
        const buyOperation: Operation = { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 };

        it("does not pay any taxes.", () => {
            const expectedTaxes: Tax[] = [
                { "tax": 0.0 },
            ]
            const operations: Operation[] = [buyOperation]

            const actualTaxes = calculateTaxes(operations, operationsBook)

            assert.deepStrictEqual(actualTaxes, expectedTaxes)
        })
    });

    describe("Given multiple operations", () => {
        const testCases: OperationTestCase[] = [
            {
                "operations": [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 5000 }
                ],
                "expectedTaxes": [
                    { "tax": 0.0 },
                    { "tax": 10000.0 }
                ]
            },
            {
                "operations": [
                    { "operation": "buy", "unit-cost": 20.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 10.00, "quantity": 5000 }
                ],
                "expectedTaxes": [
                    { "tax": 0.0 },
                    { "tax": 0.0 }
                ]
            }
        ];

        testCases.forEach(({ operations, expectedTaxes }) =>
            test("should return the taxes", () => {
                const actualTaxes = calculateTaxes(operations, operationsBook);

                assert.deepStrictEqual(actualTaxes, expectedTaxes)
            })
        )
    })

    describe("Challenge cases", () => {
        const testCases: OperationTestCase[] = [
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10, "quantity": 100 },
                    { "operation": "sell", "unit-cost": 15, "quantity": 50 },
                    { "operation": "sell", "unit-cost": 15, "quantity": 50 }
                ],
                expectedTaxes: [
                    { "tax": 0 },
                    { "tax": 0 },
                    { "tax": 0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 5.00, "quantity": 5000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 10000.0 },
                    { "tax": 0.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 5.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 3000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 1000.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "buy", "unit-cost": 25.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 15.00, "quantity": 10000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "buy", "unit-cost": 25.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 15.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 25.00, "quantity": 5000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 10000.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 2.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
                    { "operation": "sell", "unit-cost": 25.00, "quantity": 1000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 3000.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 2.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
                    { "operation": "sell", "unit-cost": 20.00, "quantity": 2000 },
                    { "operation": "sell", "unit-cost": 25.00, "quantity": 1000 },
                    { "operation": "buy", "unit-cost": 20.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 15.00, "quantity": 5000 },
                    { "operation": "sell", "unit-cost": 30.00, "quantity": 4350 },
                    { "operation": "sell", "unit-cost": 30.00, "quantity": 650 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 3000.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 3700.0 },
                    { "tax": 0.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 50.00, "quantity": 10000 },
                    { "operation": "buy", "unit-cost": 20.00, "quantity": 10000 },
                    { "operation": "sell", "unit-cost": 50.00, "quantity": 10000 }
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 80000.0 },
                    { "tax": 0.0 },
                    { "tax": 60000.0 }
                ]
            },
            {
                operations: [
                    { "operation": "buy", "unit-cost": 5000.00, "quantity": 10 },
                    { "operation": "sell", "unit-cost": 4000.00, "quantity": 5 },
                    { "operation": "buy", "unit-cost": 15000.00, "quantity": 5 },
                    { "operation": "buy", "unit-cost": 4000.00, "quantity": 2 },
                    { "operation": "buy", "unit-cost": 23000.00, "quantity": 2 },
                    { "operation": "sell", "unit-cost": 20000.00, "quantity": 1 },
                    { "operation": "sell", "unit-cost": 12000.00, "quantity": 10 },
                    { "operation": "sell", "unit-cost": 15000.00, "quantity": 3 },
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 1000.0 },
                    { "tax": 2400.0 }
                ]
            }
        ];

        testCases.forEach(({ operations, expectedTaxes }, i) =>
            test(`Case #${i + 1}`, () => {
                const actualTaxes = calculateTaxes(operations, operationsBook);

                assert.deepStrictEqual(actualTaxes, expectedTaxes)
            })
        );
    });
})
