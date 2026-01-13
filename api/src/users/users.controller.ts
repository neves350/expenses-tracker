import { Body, Controller, ForbiddenException, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ApiChangePasswordResponses } from 'src/decorators/api-responses/users-change-password.decorator'
import { ApiFindByIdResponses } from 'src/decorators/api-responses/users-response.decorator'
import { ApiUpdateByIdResponses } from 'src/decorators/api-responses/users-update-response.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { ChangePasswordDto } from './dtos/change-password.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get user by id' })
  @ApiFindByIdResponses()
	async findById(@Param('id') id: string, @CurrentUser() user) {
    // verify if user can access own data
    if (id !== user.userId) throw new ForbiddenException('You can only access your own data')

		return await this.usersService.findById(id)
	}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Update user by id' })
  @ApiUpdateByIdResponses()
  async updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user) {
    if (id !== user.userId) {
      throw new ForbiddenException('You can only access your own data')
    }
    
    return this.usersService.updateById(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/password')
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Update user password by id' })
  @ApiChangePasswordResponses()
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user) {
    if (id !== user.userId) throw new ForbiddenException('You can only access your own data')
    
    return this.usersService.changePassword(id, changePasswordDto)
  }
}
