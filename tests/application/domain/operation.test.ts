import { describe, it } from "node:test";
import assert from "node:assert";
import { CreateOperation } from "../../../src/application/domain/operation";

describe("Operation", () => {
    it("should be created with quantity, unitCost and operation type", () => {
        assert.doesNotThrow(() => CreateOperation('buy', 10.0, 10));
    })

    describe("For a buy", () => {
        it("gross profit should be 0", () => {
            const operation = CreateOperation('buy', 10.0, 10);

            assert.equal(operation.getGrossProfit(), 0);
            assert.equal(operation.getQuantity(), 10);
        })
    })


    describe("For a sell operation", () => {
        it("gross profit should be positive", () => {
            const operation = CreateOperation('sell', 10.0, 10)

            assert.equal(operation.getGrossProfit(), 100.0);
        })
    })

    describe("Quantity", () => {
        const testCases = [
            {
                operation: CreateOperation('buy', 10.0, 10),
                expected: 10
            },
            {
                operation: CreateOperation('sell', 10.0, 10),
                expected: -10
            }
        ];

        it("should return quantity signed based on type", () => {
            testCases.forEach(({ operation, expected }) =>
                assert.equal(operation.getQuantity(), expected)
            )
        })
    })
})
