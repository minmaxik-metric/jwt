import { DynamicModule, Global, Module } from "@nestjs/common"
import { JwtModule, JwtVerifyOptions } from "@nestjs/jwt"

import { CONSUMER_OPTIONS } from "../constants"
import { ConsumerAsyncOptions, ConsumerOptions } from "../interfaces"

import {
	createConsumerAsyncOptionsProvider,
	createConsumerOptionsProvider
} from "./consumer.provider"
import { ConsumerService } from "./consumer.service"

const JWT_VERIFY_OPTIONS = {
	algorithms: ["RS256"],
	issuer: "auth-service",
	audience: "gateway-service"
} satisfies JwtVerifyOptions

@Global()
@Module({})
export class ConsumerModule {
	public static register(options: ConsumerOptions): DynamicModule {
		const optionsProvider = createConsumerOptionsProvider(options)

		return {
			module: ConsumerModule,
			imports: [
				JwtModule.register({
					publicKey: options.publicKey,
					signOptions: JWT_VERIFY_OPTIONS
				})
			],
			providers: [optionsProvider, ConsumerService],
			exports: [ConsumerService, CONSUMER_OPTIONS]
		}
	}

	public static registerAsync(options: ConsumerAsyncOptions): DynamicModule {
		const optionsProvider = createConsumerAsyncOptionsProvider(options)

		return {
			module: ConsumerModule,
			imports: [
				...(options.imports || []),
				JwtModule.registerAsync({
					useFactory: async (options: ConsumerOptions) => ({
						publicKey: options.publicKey,
						signOptions: JWT_VERIFY_OPTIONS
					}),
					inject: [CONSUMER_OPTIONS]
				})
			],
			providers: [optionsProvider, ConsumerService],
			exports: [ConsumerService, CONSUMER_OPTIONS]
		}
	}
}
