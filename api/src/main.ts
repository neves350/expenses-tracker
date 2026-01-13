import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('Expenses Tracker API')
		.setDescription(
			'API for tracking personal and business expenses, managing budgets, and generating financial reports',
		)
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, documentFactory)

	app.use(
		'/docs',
		apiReference({
			theme: 'elysiajs',
			content: documentFactory,
		}),
	)

	app.useGlobalPipes(new ValidationPipe())

	await app.listen(process.env.PORT ?? 3000)
	Logger.log('🚀 HTTP Server Running!')
}
bootstrap()
