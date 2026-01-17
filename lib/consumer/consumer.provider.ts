import { Provider } from "@nestjs/common"

import { CONSUMER_OPTIONS } from "../constants"
import { ConsumerAsyncOptions, ConsumerOptions } from "../interfaces"

export function createConsumerOptionsProvider(
	options: ConsumerOptions
): Provider {
	return {
		provide: CONSUMER_OPTIONS,
		useValue: Object.freeze({ ...options })
	}
}

export function createConsumerAsyncOptionsProvider(
	options: ConsumerAsyncOptions
): Provider {
	return {
		provide: CONSUMER_OPTIONS,
		useFactory: async (...args: any[]) => {
			const resolved = await options.useFactory(...args)

			if (!resolved || typeof resolved.publicKey !== "string") {
				throw new Error(
					`[ConsumerModule] "publicKey" is required and must be a string`
				)
			}

			return Object.freeze({ ...resolved })
		},
		inject: options.inject ?? []
	}
}
