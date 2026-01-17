import type { FactoryProvider, ModuleMetadata } from "@nestjs/common"

import type { IssuerOptions } from "./issuer-options.interface"

export interface IssuerAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	useFactory?: (...args: any[]) => Promise<IssuerOptions> | IssuerOptions
	inject?: FactoryProvider["inject"]
}
