import type { FactoryProvider, ModuleMetadata } from "@nestjs/common"

import type { ConsumerOptions } from "./consumer-options.interface"

export interface ConsumerAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	useFactory?: (...args: any[]) => Promise<ConsumerOptions> | ConsumerOptions
	inject?: FactoryProvider["inject"]
}
