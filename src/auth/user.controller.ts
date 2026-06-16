import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidRoles } from './enums/valid-role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @Auth(
    ValidRoles.admin,
    ValidRoles.supervisor,
    ValidRoles.collaborator,
    ValidRoles.manager,
  )
  findByTerm(@Query('term') term: string, @GetUser('id') user: string) {
    return this.userService.getUserByTerm(term, user);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this.userService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
