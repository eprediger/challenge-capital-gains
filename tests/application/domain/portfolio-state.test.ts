import { describe, test, it } from "node:test";
import assert from "node:assert";
import { CreatePortfolio, Portfolio } from "../../../src/application/domain/portfolio-state";
import { CreateOperation } from "../../../src/application/domain/operation";

describe("PortfolioState", () => {
    it("should be created empty", () => {
        let portfolio: Portfolio = CreatePortfolio();

        assert.equal(portfolio.getQuantity(), 0);
        assert.equal(portfolio.getLosses(), 0);
        assert.equal(portfolio.getWeightedAveragePrice(), 0);
        assert.equal(portfolio.getLastOperationProfit(), 0);
        assert.equal(portfolio.getNetProfit(), 0);
    });

    it("should return 0 the net result from an buy operation", () => {
        const portfolio = CreatePortfolio();
        const operation = CreateOperation('buy', 10.0, 10);

        assert.equal(portfolio.getOperationNetResult(operation), 0.00);
    });

    it("should update its quantity", () => {
        const expectedQuantity = 1;
        const portfolio = CreatePortfolio();
        const operations = [
            CreateOperation('buy', 10.0, 10),
            CreateOperation('sell', 10.0, 8),
            CreateOperation('buy', 10.0, 6),
            CreateOperation('buy', 10.0, 1),
            CreateOperation('sell', 10.0, 8),
        ];
        operations.forEach(operation => portfolio.book(operation))

        const actualQuantity = portfolio.getQuantity();

        assert.equal(actualQuantity, expectedQuantity, `The expected was ${expectedQuantity}, but it returned ${actualQuantity}` )
    });

    test("selling over the bought price", () => {
        const portfolio = CreatePortfolio();
        const operations = [
            CreateOperation("buy", 10.00, 10000),
            CreateOperation("sell", 20.00, 5000),
            // CreateOperation("buy", 20.00, 10000),
            // CreateOperation("sell", 10.00, 5000)
        ]

        operations.forEach(operation => portfolio.book(operation))

        assert.equal(portfolio.getQuantity(), 5000)
        assert.equal(portfolio.getLastOperationProfit(), 100000.0)
        assert.equal(portfolio.getNetProfit(), 50000.0)
        assert.equal(portfolio.getLosses(), 0)
    });
});
