import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { UserOrmEntity } from './entities/user.orm.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { HashOptions } from './interfaces/hashing';
import { formatDates } from 'src/common/functions/formatDates';
import { UserResponse } from './interfaces/user-response';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, secret } = signUpDto;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      this.logger.error('This email already exists');
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon2.hash(secret, HashOptions);
    const { role, ...signUpData } = signUpDto;

    const entityData: Partial<UserOrmEntity> = {
      ...signUpData,
      secret: hashedPassword,
      createdAt: new Date(formatDates(signUpDto.createdAt)),
      updatedAt: new Date(),
      isActive: true,
      ...(role ? { roles: [role] } : {}),
    };
    const newUser = await this.userRepository.create(entityData);
    this.logger.log('User created successfully');
    
    return {
      token: this._getJwtToken({ id: newUser.id, email: newUser.email }),
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserResponse; token: string }> {
    const { email, secret } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.secret, secret);
    if (!isPasswordValid) {
      this.logger.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    const userResponse = this._UserResponse(user);
    this.logger.log('User logged in successfully');
    return {
      user: userResponse,
      token: this._getJwtToken({ id: user.id, email: user.email }),
    };
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
    updateAuthDto: UpdateAuthDto,
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

  private _getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private _UserResponse(user: UserOrmEntity): UserResponse {
    const userResponse = {
      id: user.id,
      name: user.name,
      lastname: user.lastName,
      email: user.email,
    };

    return userResponse;
  }
}
