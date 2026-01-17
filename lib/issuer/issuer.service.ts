import { Injectable } from "@nestjs/common"
import { JwtService, JwtSignOptions } from "@nestjs/jwt"

import { TokenPayload } from "../interfaces"

@Injectable()
export class IssuerService {
	constructor(private readonly jwtService: JwtService) {}

	public sign(payload: TokenPayload, options?: JwtSignOptions): string {
		return this.jwtService.sign(payload, options)
	}

	public signAsync(payload: TokenPayload, options?: JwtSignOptions) {
		return this.jwtService.signAsync(payload, options)
	}
}
