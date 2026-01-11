import { Body, Controller, Post, } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiAuthSuccessResponse, ApiBadRequestResponse, ApiCreateResponse, ApiUnauthorizedResponse } from 'src/decorators/auth-responses.decorator'
import { AuthService } from './auth.service'
import { LoginUserDTO, RegisterUserDTO } from './dto/auth.dto'

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


}
