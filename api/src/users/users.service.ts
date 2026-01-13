import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				avatarUrl: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		})
	}

	async updateById(id: string, updateUserDto: UpdateUserDto) {
		// check if user emails already exists
		const existingUser = await this.prisma.user.findUnique({
			where: { id },
		})

		if (!existingUser) throw new NotFoundException('User not found')

		// check if email has trying to be updated not exists
		if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
			const emailExists = await this.prisma.user.findUnique({
				where: {
					email: updateUserDto.email,
				},
			})

			if (emailExists)
				throw new ConflictException(
					'This email already exists, please choose a new one',
				)
		}

		// update user profile
		return this.prisma.user.update({
			where: {
				id,
			},
			data: updateUserDto,
		})
	}
}
