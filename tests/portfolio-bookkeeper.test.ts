import assert from 'node:assert';
import test, { describe } from 'node:test';
import { bookOperations, Operation } from '../src/portfolio-bookkeeper.js';

describe('Weighted Average Price', () => {
  test("for one operation should be the unit-cost", () => {
    const operations: Operation[] = [
      {
        operation: 'buy',
        'unit-cost': 20.0,
        quantity: 10
      }
    ]

    const portfolio = bookOperations(operations);

    const actualPrice = portfolio.weightedAveragePrice;
    const expectedPrice: number = 20.0;

    assert.strictEqual(actualPrice, expectedPrice, `Actual price (${actualPrice}) != Expected price (${expectedPrice}) `)
  })

  test('price is the average price taking the amount purchased', () => {
    const operations: Operation[] = [
      {
        "operation": "buy",
        "unit-cost": 20.0,
        "quantity": 10
      },
      {
        "operation": "sell",
        "unit-cost": 10.0,
        "quantity": 5
      },
      {
        "operation": "buy",
        "unit-cost": 10.0,
        "quantity": 5
      }
    ]

    const portfolio = bookOperations(operations);

    const actualPrice = portfolio.weightedAveragePrice;
    const expectedPrice: number = 15.0;

    assert.strictEqual(actualPrice, expectedPrice, `Actual price (${actualPrice}) != Expected price (${expectedPrice}) `);
  })
});
