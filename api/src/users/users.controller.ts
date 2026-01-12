import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from 'src/decorators/api-responses/users-response.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
  @ApiBearerAuth('JWT-auth') 
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
	async findById(@Param('id') id: string, @CurrentUser() user) {
    // verify if user can access own data
    if (id !== user.userId) throw new ForbiddenException('You can only access your own data')

		return await this.usersService.findById(id)
	}
}
