import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { CategoryService } from './category.service'
import { CreateCategory } from './dtos/create-category.dto'
import { QueryCategoryDto } from './dtos/query-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto'

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

	@UseGuards(JwtAuthGuard)
	@Get('categories/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get category by id',
		description: 'Get category for the user.',
	})
	async findOne(@Param('id') id: string, @CurrentUser() user) {
		return this.categoryService.findOne(id, user.sub)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('categories/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Update category by id',
		description: 'Updates the category information.',
	})
	async update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
		@CurrentUser() user,
	) {
		return this.categoryService.update(id, user.userId, updateCategoryDto)
	}

	@UseGuards(JwtAuthGuard)
	@Delete('categories/:id')
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Delete category by id',
		description: 'Deletes the category information.',
	})
	async delete(@Param('id') id: string, @CurrentUser() user) {
		return this.categoryService.delete(id, user.userId)
	}
}
