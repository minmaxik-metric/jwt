import { ModuleMetadata, Provider, Type } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

export interface JwtModuleOptions {
	publicKey?: jwt.Secret
	privateKey?: jwt.Secret
}

export interface JwtOptionsFactory {
	createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions
}

export interface JwtModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
	useExisting?: Type<JwtOptionsFactory>
	useClass?: Type<JwtOptionsFactory>
	useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions
	inject?: any[]
	extraProviders?: Provider[]
}

export interface JwtSignOptions extends jwt.SignOptions {
	privateKey?: jwt.Secret
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
	publicKey?: jwt.Secret
}
