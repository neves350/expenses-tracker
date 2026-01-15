import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CategoryService } from './category.service'
import { CreateCategory } from './dtos/create-category.dto'
import { QueryCategoryDto } from './dtos/query-category.dto'

@ApiTags('Categories')
@Controller()
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@UseGuards(JwtAuthGuard)
	@Post('categories')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Create a new category',
		description:
			'Creates a new category with title, type, icon and icon color.',
	})
	async create(@Body() createCategory: CreateCategory, @CurrentUser() user) {
		const category = await this.categoryService.create(
			createCategory,
			user.userId,
		)

		return {
			category,
			message: 'Category created successfull',
		}
	}

	// query params - type=ICONME EXPENSE
	@UseGuards(JwtAuthGuard)
	@Get('categories')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get all categories',
		description: 'Get all categories from user.',
	})
	async findAll(@CurrentUser() user, @Query() query: QueryCategoryDto) {
		return this.categoryService.findAll(user.userId, query.type)
	}
}
