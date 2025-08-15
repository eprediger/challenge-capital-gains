import type { Tax } from "../../application/domain/tax.ts";
import type { TaxFormatter } from "../../application/ports/config.ts";

export const CreateTaxFormatter = (): TaxFormatter =>
    (taxes: readonly Tax[]): string => JSON.stringify(taxes)
