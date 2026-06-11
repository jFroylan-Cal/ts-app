import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async create(user: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const newUser = this.ormRepository.create(user);
    return await this.ormRepository.save(newUser);
  }

  async update(
    id: string,
    user: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity> {
    const existingUser = await this.findById(id);
    const updatedUser = this.ormRepository.merge(existingUser, user);
    return await this.ormRepository.save(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const existingUser = await this.findById(id);
    await this.ormRepository.remove(existingUser);
  }

  async findById(id: string): Promise<UserOrmEntity> {
    const user = await this.ormRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserOrmEntity | null> {
    return await this.ormRepository.findOneBy({ email });
  }
}
