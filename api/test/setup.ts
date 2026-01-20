import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

export async function createTestApp(): Promise<INestApplication> {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile()

	const app = moduleFixture.createNestApplication()
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
	await app.init()

	return app
}

export interface TestContext {
	authToken?: string
	userId?: string
	walletId?: string
	categoryId?: string
	transactionId?: string
	goalId?: string
}
