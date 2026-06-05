import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserOrmEntity> {
    const { email, secret } = signUpDto;
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await argon2.hash(secret, HashOptions);

    const newUser = await this.userRepository.create({
      ...signUpDto,
      secret: hashedPassword,
    });

    delete (newUser as any).secret;
    return newUser;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: UserOrmEntity; token: string }> {
    const { email, secret } = loginDto;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.secret, secret);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userResponse = { ...user };
    delete (userResponse as any).secret;

    return {
      user: userResponse,
      token: this._getJwtToken({ id: user.id, email: user.email }),
    };
  }

  async findOne(id: string): Promise<UserOrmEntity> {
    const user = await this.userRepository.findById(id);
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
    const updatedUser = await this.userRepository.update(id, updateAuthDto);
    delete (updatedUser as any).secret;
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private _getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
