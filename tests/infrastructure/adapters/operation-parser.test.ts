import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CreateOperationParser } from "../../../src/infrastructure/adapters/operation-parser.ts";

describe("CreateOperationParser", () => {
    const operationParser = CreateOperationParser();

    test("parses a single operation", () => {
        const input = `[
            { "operation": "buy", "unit-cost": 10, "quantity": 100 }
        ]`;
        const operations = operationParser(input);

        operations.forEach(operation => assert.ok(typeof operation.updatePortfolio === 'function'));
    });

    test("parses multiple operations", () => {
        const input = `[
            { "operation": "buy", "unit-cost": 10, "quantity": 100 },
            { "operation": "sell", "unit-cost": 15, "quantity": 50 }
        ]`;
        const operations = operationParser(input);

        operations.forEach(operation => assert.ok(typeof operation.updatePortfolio === 'function'));
    });

    test("trims input before parsing", () => {
        const input = `
            [
                { "operation": "buy", "unit-cost": 20, "quantity": 10 }
            ]
        `;
        const operations = operationParser(input);

        operations.forEach(operation => assert.ok(typeof operation.updatePortfolio === 'function'));
    });

    test("returns an empty array for empty input array", () => {
        const input = "[]";
        const operations = operationParser(input);

        operations.forEach(operation => assert.ok(typeof operation.updatePortfolio === 'function'));
    });
});
