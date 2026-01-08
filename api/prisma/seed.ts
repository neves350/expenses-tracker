import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from 'src/generated/prisma/client'
import { Categories } from './categories'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['query'] })

async function seed() {
	// Create categories list to the table
	for (const category of Categories) {
		const { ...categories } = category

		await prisma.category.create({
			data: {
				icon: categories.icon,
				title: categories.title,
				type: categories.type,
			},
		})
	}
}

seed().then(() => {
	console.log('Database seeded!')
	prisma.$disconnect()
})
