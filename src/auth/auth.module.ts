import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserOrmEntity } from './entities/user.orm.entity';
import { UserRepositoryImpl } from './repository/user.repository.impl';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRoleGuard } from './guards/user-role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepositoryImpl, JwtStrategy, UserRoleGuard],
  exports: [
    UserRepositoryImpl,
    TypeOrmModule,
    PassportModule,
    JwtModule,
    JwtStrategy,
  ],
})
export class AuthModule {}
