import { DynamicModule, Global, Module } from "@nestjs/common"
import { JwtModule, JwtSignOptions } from "@nestjs/jwt"

import { ISSUER_OPTIONS } from "../constants"
import { IssuerAsyncOptions, IssuerOptions } from "../interfaces"

import {
	createIssuerAsyncOptionsProvider,
	createIssuerOptionsProvider
} from "./issuer.provider"
import { IssuerService } from "./issuer.service"

const JWT_SIGN_OPTIONS = {
	algorithm: "RS256",
	issuer: "auth-service",
	audience: "gateway-service",
	keyid: "auth.v1"
} satisfies JwtSignOptions

@Global()
@Module({})
export class IssuerModule {
	public static register(options: IssuerOptions): DynamicModule {
		const optionsProvider = createIssuerOptionsProvider(options)

		return {
			module: IssuerModule,
			imports: [
				JwtModule.register({
					privateKey: options.privateKey,
					signOptions: JWT_SIGN_OPTIONS
				})
			],
			providers: [optionsProvider, IssuerService],
			exports: [IssuerService, ISSUER_OPTIONS]
		}
	}

	public static registerAsync(options: IssuerAsyncOptions): DynamicModule {
		const optionsProvider = createIssuerAsyncOptionsProvider(options)

		return {
			module: IssuerModule,
			imports: [
				...(options.imports || []),
				JwtModule.registerAsync({
					useFactory: async (options: IssuerOptions) => ({
						privateKey: options.privateKey,
						signOptions: JWT_SIGN_OPTIONS
					}),
					inject: [ISSUER_OPTIONS]
				})
			],
			providers: [optionsProvider, IssuerService],
			exports: [IssuerService, ISSUER_OPTIONS]
		}
	}
}
