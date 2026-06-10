import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PostResponse } from 'src/common/decorators/api-response.decorator';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './enums/valid-role.enum';

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

  @Get(':id')
  @Auth(ValidRoles.admin,ValidRoles.supervisor, ValidRoles.manager, ValidRoles.collaborator)
  findOne(@Param('id') id: string ) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
