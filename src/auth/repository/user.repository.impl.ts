import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async create(userDto: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUserInstance = queryRunner.manager.create(
        UserOrmEntity,
        userDto,
      );
      const savedUser = await queryRunner.manager.save(newUserInstance);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    user: Partial<UserOrmEntity>,
  ): Promise<UserOrmEntity | null> {
    const userToUpdate = await this.ormRepository.preload({
      id,
      ...user,
    });
    if (!userToUpdate) {
      return null;
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(userToUpdate);
      await queryRunner.commitTransaction();
      return userToUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.ormRepository.findOneBy({ id });
      if (!user) {
        return;
      }
      user.isActive = false;
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string): Promise<UserOrmEntity | null> {
    const user = await this.ormRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string): Promise<UserOrmEntity | null> {
    const user = await this.ormRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        secret: true,
        name: true,
        lastName: true,
      },
    });
    return user;
  }

  async findByTerm(term: string) {
    const user = await this.ormRepository.find({
      where: [
        { name: ILike(`%${term}%`) },
        { lastName: ILike(`%${term}%`) },
        { email: ILike(`%${term}%`) },
      ],
    });
    return user;
  }

  async findAll(): Promise<UserOrmEntity[]> {
    const users = await this.ormRepository.find();
    return users;
  }
}
