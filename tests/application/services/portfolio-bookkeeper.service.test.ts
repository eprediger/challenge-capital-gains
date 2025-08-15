import assert from 'node:assert';
import test, { beforeEach, describe } from 'node:test';

import { Operation } from '../../../src/application/domain/operation';
import { OperationsBookkeeper } from '../../../src/application/ports/operations-booking-use-case';
import { CreateOperationsBookkeeper } from "../../../src/application/services/operations-bookkeeping.service";

const bookOperations = (operations: readonly Operation[], operationsBook: OperationsBookkeeper): void => {
  for (const operation of operations) {
    operationsBook.state = operationsBook.bookOperation(operationsBook.state, operation)
  }
}

describe('Weighted Average Price', () => {
  let operationsBook: OperationsBookkeeper;

  beforeEach(() => {
    operationsBook = CreateOperationsBookkeeper()
  })

  test("for one operation should be the unit-cost", () => {
    const operations: Operation[] = [
      {
        operation: 'buy',
        'unit-cost': 20.0,
        quantity: 10
      }
    ]

    bookOperations(operations, operationsBook);

    const actualPrice = operationsBook.state.weightedAveragePrice;
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

    bookOperations(operations, operationsBook);;

    const actualPrice = operationsBook.state.weightedAveragePrice;
    const expectedPrice: number = 15.0;

    assert.strictEqual(actualPrice, expectedPrice, `Actual price (${actualPrice}) != Expected price (${expectedPrice}) `);
  })
});
