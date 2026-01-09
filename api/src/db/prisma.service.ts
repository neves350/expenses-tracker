import {
	Injectable,
	type OnModuleDestroy,
	type OnModuleInit,
} from '@nestjs/common'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../generated/prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		console.log('DATABASE_URL:', process.env.DATABASE_URL)
		const adapter = new PrismaNeon({
			connectionString: process.env.DATABASE_URL as string,
		})
		super({ adapter })
	}

	async onModuleInit() {
		try {
			await this.$connect()
			console.log('✅ Connected to Neon database')
		} catch (error) {
			console.error('❌ Failed to connect to database:', error)
			throw error
		}
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}
