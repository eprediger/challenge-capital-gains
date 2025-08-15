import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { CreateTaxFormatter } from "../../../src/infrastructure/adapters/tax-formatter.ts";
import { Tax } from "../../../src/application/domain/tax.ts";

describe("CreateTaxFormatter", () => {
    const taxFormatter = CreateTaxFormatter();

    test("formats a single tax object", () => {
        const taxes: Tax[] = [
            { tax: 10 }
        ];
        const result = taxFormatter(taxes);
        assert.strictEqual(result, JSON.stringify(taxes));
    });

    test("formats multiple tax objects", () => {
        const taxes: Tax[] = [
            { tax: 10 },
            { tax: 0 },
            { tax: 20.5 }
        ];
        const result = taxFormatter(taxes);
        assert.strictEqual(result, JSON.stringify(taxes));
    });

    test("formats an empty array", () => {
        const taxes: Tax[] = [];
        const result = taxFormatter(taxes);
        assert.strictEqual(result, "[]");
    });
});
