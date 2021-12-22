import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({  
    imports: [ 
        UsersModule,   
        ConfigModule, 
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {
                expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
              },
            }),
          }),
    ], 
    controllers: [AuthController],  
    providers: [AuthService, JwtStrategy, LocalStrategy],
    exports: [
        PassportModule, 
        JwtModule
    ],
})
export class AuthModule {}

