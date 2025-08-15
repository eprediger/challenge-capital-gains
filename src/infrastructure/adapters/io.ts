import type { InputReader, OutputWriter } from "../../application/ports/config.ts"
import * as readline from "readline"

export const CreateInputReader = (): InputReader =>
    async (): Promise<readonly string[]> => {
        const rl = readline.createInterface({
            input: process.stdin
        })

        const lines: string[] = []
        for await (const line of rl) {
            if (line.trim() === '') break
            lines.push(line)
        }

        rl.close()
        return lines
    }

export const CreateOutputWriter = (): OutputWriter =>
    async (output: string): Promise<void> => {
        process.stdout.write(`${output}\n`)
    }
