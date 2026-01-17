import { DynamicModule } from "@nestjs/common"
import { JwtModule, JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt"

export interface IssuerModuleOptions {
	privateKey: string
}

const SIGN_OPTIONS = {
	algorithm: "RS256",
	issuer: "auth-service",
	audience: "gateway-service",
	keyid: "auth.v1"
} satisfies JwtSignOptions

export function createIssuerModule(
	options: IssuerModuleOptions
): DynamicModule {
	const jwtOptions: JwtModuleOptions = {
		privateKey: options.privateKey,
		signOptions: SIGN_OPTIONS
	}

	return JwtModule.register(jwtOptions)
}

export function createIssuerModuleAsync(
	useFactory: (
		...args: any[]
	) => Promise<IssuerModuleOptions> | IssuerModuleOptions,
	inject?: any[]
): DynamicModule {
	return JwtModule.registerAsync({
		useFactory: async (...args: any[]) => {
			const options = await useFactory(...args)

			return {
				privateKey: options.privateKey,
				signOptions: SIGN_OPTIONS
			}
		},
		inject: inject || []
	})
}
