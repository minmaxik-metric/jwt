import { Injectable } from "@nestjs/common"
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt"

import { TokenPayload } from "../interfaces"

@Injectable()
export class ConsumerService {
	constructor(private readonly jwtService: JwtService) {}

	public verify(token: string, options?: JwtVerifyOptions) {
		return this.jwtService.verify<TokenPayload>(token, options)
	}

	public verifyAsync(token: string, options?: JwtVerifyOptions) {
		return this.jwtService.verifyAsync<TokenPayload>(token, options)
	}
}
