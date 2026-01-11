import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'

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
}
