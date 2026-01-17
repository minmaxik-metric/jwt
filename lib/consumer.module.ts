import { DynamicModule } from "@nestjs/common"
import { JwtModule, JwtModuleOptions, JwtVerifyOptions } from "@nestjs/jwt"

export interface ConsumerModuleOptions {
	publicKey: string
}

const VERIFY_OPTIONS = {
	algorithms: ["RS256"],
	issuer: "auth-service",
	audience: "gateway-service"
} satisfies JwtVerifyOptions

export function createConsumerModule(
	options: ConsumerModuleOptions
): DynamicModule {
	const jwtOptions: JwtModuleOptions = {
		publicKey: options.publicKey,
		verifyOptions: VERIFY_OPTIONS
	}

	return JwtModule.register(jwtOptions)
}

export function createConsumerModuleAsync(
	useFactory: (
		...args: any[]
	) => Promise<ConsumerModuleOptions> | ConsumerModuleOptions,
	inject?: any[]
): DynamicModule {
	return JwtModule.registerAsync({
		useFactory: async (...args: any[]) => {
			const options = await useFactory(...args)

			return {
				publicKey: options.publicKey,
				verifyOptions: VERIFY_OPTIONS
			}
		},
		inject: inject || []
	})
}
