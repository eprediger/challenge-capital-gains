import type { Application, Config } from "../../application/ports/config.ts";
import { CreateOperationsBookkeeper } from "../../application/services/operations-bookkeeping.service.ts";
import { CreateTaxCalculator } from "../../application/services/tax-calculator.service.ts";
import { CreateInputReader, CreateOutputWriter } from "../adapters/io.ts";
import { CreateOperationParser } from "../adapters/operation-parser.ts";
import { CreateTaxFormatter } from "../adapters/tax-formatter.ts";

const createCLIRunner = (config: Config) => async (): Promise<void> => {
    try {
        const inputLines = await config.inputReader()

        for (const line of inputLines) {
            const operations = config.parser(line)
            const taxes = config.useCase(operations)
            const output = config.formatter(taxes)
            await config.outputWriter(output)
        }
    } catch (error) {
        console.error('Error processing capital gains:', error)
        if (typeof process !== 'undefined') {
            process.exit(1)
        }
        throw error
    }
}

const createInputProcessor = (config: Config) =>
    (input: string): readonly string[] =>
        input
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const operations = config.parser(line)
                const taxes = config.useCase(operations)
                return config.formatter(taxes)
            })

export const CreateApp = (): Application => {
    const config = CreateAppConfiguration()
    return {
        run: createCLIRunner(config),
        processInput: createInputProcessor(config)
    }
}

const CreateAppConfiguration = (): Config => ({
    useCase: CreateTaxCalculator(CreateOperationsBookkeeper()),
    parser: CreateOperationParser(),
    formatter: CreateTaxFormatter(),
    inputReader: CreateInputReader(),
    outputWriter: CreateOutputWriter()
})
