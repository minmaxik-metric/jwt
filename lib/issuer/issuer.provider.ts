import { Provider } from "@nestjs/common"

import { ISSUER_OPTIONS } from "../constants"
import { IssuerAsyncOptions, IssuerOptions } from "../interfaces"

export function createIssuerOptionsProvider(options: IssuerOptions): Provider {
	return {
		provide: ISSUER_OPTIONS,
		useValue: Object.freeze({ ...options })
	}
}

export function createIssuerAsyncOptionsProvider(
	options: IssuerAsyncOptions
): Provider {
	return {
		provide: ISSUER_OPTIONS,
		useFactory: async (...args: any[]) => {
			const resolved = await options.useFactory(...args)

			if (!resolved || typeof resolved.privateKey !== "string") {
				throw new Error(
					`[IssuerModule] "privateKey" is required and must be a string`
				)
			}

			return Object.freeze({ ...resolved })
		},
		inject: options.inject ?? []
	}
}
