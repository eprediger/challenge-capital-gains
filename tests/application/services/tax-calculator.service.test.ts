import assert from "node:assert";
import test, { beforeEach, describe, it } from "node:test";
import { CreateOperation, Operation } from "../../../src/application/domain/operation";
import { Tax } from "../../../src/application/domain/tax";
import { OperationsBookkeeper } from "../../../src/application/ports/operations-booking-use-case";
import { CreateOperationsBookkeeper } from "../../../src/application/services/operations-bookkeeping.service";
import { calculateTaxes, CreateTaxCalculator } from "../../../src/application/services/tax-calculator.service";

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
        const buyOperation: Operation = CreateOperation("buy", 10.00, 10000);

        it("does not pay any taxes.", () => {
            const taxCalc = CreateTaxCalculator(operationsBook)
            const expectedTaxes: Tax[] = [
                { "tax": 0.0 },
            ]
            const operations: Operation[] = [buyOperation]

            const actualTaxes = taxCalc(operations);

            assert.deepStrictEqual(actualTaxes, expectedTaxes)
        })
    });

    describe("Given multiple operations", () => {
        const testCases: OperationTestCase[] = [
            {
                "operations": [
                    CreateOperation("buy", 10.00, 10000),
                    CreateOperation("sell", 20.00, 5000)
                ],
                "expectedTaxes": [
                    { "tax": 0.0 },
                    { "tax": 10000.0 }
                ]
            },
            {
                "operations": [
                    CreateOperation("buy", 20.00, 10000 ),
                    CreateOperation("sell", 10.00, 5000 )
                ],
                "expectedTaxes": [
                    { "tax": 0.0 },
                    { "tax": 0.0 }
                ]
            }
        ];

        testCases.forEach(({ operations, expectedTaxes }) =>
            test("should return the taxes", () => {
                const taxCalc = CreateTaxCalculator(operationsBook)
                const actualTaxes = taxCalc(operations);

                assert.deepStrictEqual(actualTaxes, expectedTaxes)
            })
        )
    })

    describe("Challenge cases", () => {
        const testCases: OperationTestCase[] = [
            {
                operations: [
                    CreateOperation("buy", 10, 100 ),
                    CreateOperation("sell", 15, 50 ),
                    CreateOperation("sell", 15, 50 )
                ],
                expectedTaxes: [
                    { "tax": 0 },
                    { "tax": 0 },
                    { "tax": 0 }
                ]
            },
            {
                operations: [
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("sell", 20.00, 5000 ),
                    CreateOperation("sell", 5.00, 5000 )
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 10000.0 },
                    { "tax": 0.0 }
                ]
            },
            {
                operations: [
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("sell", 5.00, 5000 ),
                    CreateOperation("sell", 20.00, 3000 )
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 1000.0 }
                ]
            },
            {
                operations: [
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("buy", 25.00, 5000 ),
                    CreateOperation("sell", 15.00, 10000 )
                ],
                expectedTaxes: [
                    { "tax": 0.0 },
                    { "tax": 0.0 },
                    { "tax": 0.0 }
                ]
            },
            {
                operations: [
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("buy", 25.00, 5000 ),
                    CreateOperation("sell", 15.00, 10000 ),
                    CreateOperation("sell", 25.00, 5000 )
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
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("sell", 2.00, 5000 ),
                    CreateOperation("sell", 20.00, 2000 ),
                    CreateOperation("sell", 20.00, 2000 ),
                    CreateOperation("sell", 25.00, 1000 )
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
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("sell", 2.00, 5000 ),
                    CreateOperation("sell", 20.00, 2000 ),
                    CreateOperation("sell", 20.00, 2000 ),
                    CreateOperation("sell", 25.00, 1000 ),
                    CreateOperation("buy", 20.00, 10000 ),
                    CreateOperation("sell", 15.00, 5000 ),
                    CreateOperation("sell", 30.00, 4350 ),
                    CreateOperation("sell", 30.00, 650 )
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
                    CreateOperation("buy", 10.00, 10000 ),
                    CreateOperation("sell", 50.00, 10000 ),
                    CreateOperation("buy", 20.00, 10000 ),
                    CreateOperation("sell", 50.00, 10000 )
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
                    CreateOperation("buy", 5000.00, 10 ),
                    CreateOperation("sell", 4000.00, 5 ),
                    CreateOperation("buy", 15000.00, 5 ),
                    CreateOperation("buy", 4000.00, 2 ),
                    CreateOperation("buy", 23000.00, 2 ),
                    CreateOperation("sell", 20000.00, 1 ),
                    CreateOperation("sell", 12000.00, 10 ),
                    CreateOperation("sell", 15000.00, 3 ),
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
