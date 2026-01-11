import { Body, Controller, Get, Post, UseGuards, } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiAuthSuccessResponse, ApiBadRequestResponse, ApiCreateResponse, ApiProfileResponse, ApiUnauthorizedResponse } from 'src/decorators/auth-responses.decorator'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { LoginUserDTO, RegisterUserDTO } from './dto/auth.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	
	@Post('register')
	@ApiOperation({ summary: 'Register new user' })
	@ApiCreateResponse()
	@ApiBadRequestResponse()
	async register(@Body() payload: RegisterUserDTO) {
	  return this.authService.register(payload)
	}

	@Post('login')
	@ApiOperation({ summary: 'User login' })
	@ApiAuthSuccessResponse()
	@ApiBadRequestResponse()
	@ApiUnauthorizedResponse()
	async login(@Body() payload: LoginUserDTO) {
		return this.authService.login(payload)
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	@ApiBearerAuth('JWT-auth') 
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiProfileResponse()
  @ApiUnauthorizedResponse()
	async getProfile(@CurrentUser() user) {
		return this.authService.getProfile(user.userId)
	}
}
