import { CreateApp } from "./create-app.ts";

export const main = (): void => {
    const cli = CreateApp();
    cli.run()
}
