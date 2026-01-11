import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../db/prisma.service'
import type { User } from '../generated/prisma/client'
import { LoginUserDTO, RegisterUserDTO } from './dto/auth.dto'
import { AuthEntity } from './entity/auth.entity'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async register(registerUserDto: RegisterUserDTO): Promise<User> {
		const { name, email, password } = registerUserDto

		// check if user already exists
		const findUser = await this.prisma.user.findUnique({
			where: { email },
		})

		if (findUser) throw new ConflictException('User already exists!')

		const hashedPassword = await bcrypt.hash(password, 10)

		// creates new user
		const user = await this.prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword,
			},
		})
		return user
	}

	async login(loginUserDto: LoginUserDTO): Promise<AuthEntity> {
		const { email, password } = loginUserDto

		const user = await this.prisma.user.findUnique({
			where: { email },
		})

		if (!user) throw new UnauthorizedException('Invalid email')

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

		if (!isPasswordValid) throw new UnauthorizedException('Invalid password')

		const payload = {
			sub: user.id,
			email: user.email,
		}

		const token = this.jwtService.sign(payload) // generate jwt token

		return { token }
	}
}
