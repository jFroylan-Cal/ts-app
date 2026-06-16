import { Body, Controller, Post } from '@nestjs/common';
import { PostResponse } from 'src/common/decorators/api-response.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @PostResponse('User Created Successfully')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @PostResponse('User Logged In Successfully')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
