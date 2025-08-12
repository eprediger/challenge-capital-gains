import test, { describe, it } from "node:test";
import assert from "node:assert";
import { Operation } from "../src/portfolio-bookkeeper";
import { calculateTaxes, Tax } from "../src/tax-calculator";

type OperationTestCase = {
    operations: Operation[],
    expectedTaxes: Tax[]
}

describe("Tax calculator", () => {
    describe("Given a buy operation", () => {
        const buyOperation: Operation = { "operation": "buy", "unit-cost": 10.00, "quantity": 10000 };

        it("does not pay any taxes.", () => {
            const expectedTaxes: Tax[] = [
                { "tax": 0.0 },
            ]
            const operations: Operation[] = [buyOperation]

            const actualTaxes = calculateTaxes(operations)

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
                const actualTaxes = calculateTaxes(operations);

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
            }
        ];

        testCases.forEach(({ operations, expectedTaxes }, i) =>
            test(`Case #${i + 1}`, () => {
                const actualTaxes = calculateTaxes(operations);

                assert.deepStrictEqual(actualTaxes, expectedTaxes)
            })
        );
    });
})
