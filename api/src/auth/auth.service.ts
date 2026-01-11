import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service'
import { UsersService } from 'src/users/users.service'
import { PrismaService } from '../db/prisma.service'
import type { User } from '../generated/prisma/client'
import { LoginUserDto, RegisterUserDto } from './dto/auth.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { AuthEntity } from './entity/auth.entity'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private usersService: UsersService,
		private mailService: MailService,
	) {}

	async register(registerUserDto: RegisterUserDto): Promise<User> {
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

	async login(loginUserDto: LoginUserDto): Promise<AuthEntity> {
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

	async getProfile(userId: string) {
		const user = await this.usersService.findById(userId)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async requestPasswordRecover(email: string) {
		const userFromEmail = await this.prisma.user.findUnique({
			where: { email },
		})

		if (!userFromEmail)
			throw new UnauthorizedException(
				'If email exists, you will receive a recover link',
			)

		const token = await this.prisma.token.create({
			data: {
				type: 'PASSWORD_RECOVER',
				userId: userFromEmail.id,
			},
		})

		// Send e-mail with password recover link
		await this.mailService.sendPasswordResetEmail(
			userFromEmail.email,
			token.id,
			userFromEmail.name,
		)

		return {
			message: 'If email exists, you will receive a recover link',
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const { code, newPassword } = resetPasswordDto

		const tokenFromCode = await this.prisma.token.findUnique({
			where: {
				id: code,
			},
			include: {
				user: true,
			},
		})

		if (!tokenFromCode || tokenFromCode.type !== 'PASSWORD_RECOVER') {
			throw new UnauthorizedException('Invalid link')
		}

		// create password
		const hashedPassword = await bcrypt.hash(newPassword, 10)

		await this.prisma.$transaction([
			// update user
			this.prisma.user.update({
				where: {
					id: tokenFromCode.userId,
				},
				data: {
					passwordHash: hashedPassword,
				},
			}),

			// delete token
			this.prisma.token.delete({
				where: {
					id: code,
				},
			}),
		])

		return {
			message: 'Success on password reset',
		}
	}
}
