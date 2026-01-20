import { Inject, Injectable, Optional } from "@nestjs/common"
import * as jwt from "jsonwebtoken"

import {
	JwtModuleOptions,
	JwtSignOptions,
	JwtVerifyOptions,
	TokenPayload
} from "./interfaces"
import { JWT_MODULE_OPTIONS } from "./jwt.constants"

const SIGN_OPTIONS: jwt.SignOptions = {
	algorithm: "RS256",
	issuer: "auth-service",
	audience: "gateway-service",
	keyid: "auth.v1"
}

const VERIFY_OPTIONS: jwt.VerifyOptions = {
	algorithms: ["RS256"],
	issuer: "auth-service",
	audience: "gateway-service"
}

@Injectable()
export class JwtService {
	public constructor(
		@Optional()
		@Inject(JWT_MODULE_OPTIONS)
		private readonly options: JwtModuleOptions = {}
	) {}

	public sign(payload: TokenPayload, options?: JwtSignOptions): string {
		const signOptions = this.mergeJwtOptions(
			{ ...options },
			"signOptions"
		) as jwt.SignOptions
		const privateKey = this.getSecretKey(options, "privateKey")

		if (!privateKey) {
			throw new Error('"privateKey" must be provided for "sign" function')
		}
		return jwt.sign(payload, privateKey, signOptions)
	}

	public signAsync(
		payload: TokenPayload,
		options?: JwtSignOptions
	): Promise<string> {
		const signOptions = this.mergeJwtOptions(
			{ ...options },
			"signOptions"
		) as jwt.SignOptions
		const privateKey = this.getSecretKey(options, "privateKey")

		if (!privateKey) {
			throw new Error('"privateKey" must be provided for "sign" function')
		}

		return new Promise((resolve, reject) =>
			jwt.sign(payload, privateKey, signOptions, (err, token) =>
				err ? reject(err) : resolve(token)
			)
		)
	}

	public verify(token: string, options?: JwtVerifyOptions): TokenPayload {
		const verifyOptions = this.mergeJwtOptions(
			{ ...options },
			"verifyOptions"
		) as jwt.VerifyOptions

		const publicKey = this.getSecretKey(options, "publicKey")

		return jwt.verify(token, publicKey, verifyOptions) as TokenPayload
	}

	public verifyAsync(
		token: string,
		options?: JwtVerifyOptions
	): Promise<TokenPayload> {
		const verifyOptions = this.mergeJwtOptions(
			{ ...options },
			"verifyOptions"
		) as jwt.VerifyOptions

		const publicKey = this.getSecretKey(options, "publicKey")

		return new Promise((resolve, reject) =>
			jwt.verify(token, publicKey, verifyOptions, (err, decoded) =>
				err ? reject(err) : resolve(decoded as TokenPayload)
			)
		)
	}

	public decode(token: string, options?: jwt.DecodeOptions): TokenPayload {
		return jwt.decode(token, options) as TokenPayload
	}

	private mergeJwtOptions(
		options: JwtSignOptions | JwtVerifyOptions,
		key: "signOptions" | "verifyOptions"
	): jwt.SignOptions | jwt.VerifyOptions {
		if (key === "signOptions") {
			return { ...SIGN_OPTIONS, ...options } as jwt.SignOptions
		}
		return { ...VERIFY_OPTIONS, ...options } as jwt.VerifyOptions
	}

	private getSecretKey(
		options: JwtVerifyOptions | JwtSignOptions,
		key: "publicKey" | "privateKey"
	): jwt.Secret {
		const secret =
			(key === "privateKey"
				? (options as JwtSignOptions)?.privateKey || this.options.privateKey
				: (options as JwtVerifyOptions)?.publicKey || this.options.publicKey) ||
			this.options[key]

		return secret
	}
}
