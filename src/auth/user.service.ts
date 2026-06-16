import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOrmEntity } from './entities/user.orm.entity';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { formatDates } from 'src/common/functions/formatDates';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async getUserByTerm(term: string, user: string) {
    if (term.length !== 0 && term) {
      const users = await this.userRepository.findByTerm(term);
      if (users.length === 0) {
        this.logger.error('User not found');
        throw new NotFoundException('User not found');
      }
      return users;
    }
    return [];
  }

  async findAll(): Promise<UserOrmEntity[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async findOne(id: string): Promise<UserOrmEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException('User not found');
    }
    delete (user as any).secret;
    return user;
  }

  async update(
    id: string,
    updateAuthDto: UpdateUserDto,
  ): Promise<UserOrmEntity> {
    if (updateAuthDto.secret) {
      updateAuthDto.secret = await argon2.hash(updateAuthDto.secret);
    }
    const { role, ...updateAuthData } = updateAuthDto;
    const updatedUser = await this.userRepository.update(id, {
      ...updateAuthData,
      updatedAt: new Date(formatDates(updateAuthDto.updatedAt)),
      ...(role ? { roles: [role] } : {}),
    });
    if (!updatedUser) {
      this.logger.warn(`Update rejected: User does not exist`);
      throw new NotFoundException(`User not found`);
    }
    this.logger.log(`User with ID updated successfully`);
    const userResponse = { ...updatedUser };
    delete (userResponse as any).secret;
    return userResponse;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
    this.logger.log('User deleted successfully');
  }

  private async _validateUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      this.logger.error('User not found');
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
