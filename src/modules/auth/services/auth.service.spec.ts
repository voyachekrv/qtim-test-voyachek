import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from '../entities';
import { UserMapper } from '../mappers';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AccessTokenDto } from '../dto/token';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Partial<Repository<UserEntity>>;
  let userMapper: Partial<UserMapper>;
  let jwtService: Partial<JwtService>;

  const fakeUser: UserEntity = new UserEntity();
  fakeUser.id = 'id123';
  fakeUser.createdAt = new Date();
  fakeUser.updatedAt = new Date();
  fakeUser.username = 'test_user';
  fakeUser.passwordHash = 'hashed_password';

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn()
    };

    userMapper = {
      toEntity: jest.fn(dto =>
        Promise.resolve({ username: dto.username, passwordHash: fakeUser.passwordHash } as UserEntity)
      )
    };

    jwtService = {
      sign: jest.fn(() => 'jwt.token.example')
    };

    authService = new AuthService(
      userRepository as Repository<UserEntity>,
      userMapper as UserMapper,
      jwtService as JwtService
    );
  });

  describe('signIn', () => {
    it('should return AccessTokenDto on correct data', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(fakeUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const dto = { username: fakeUser.username, password: 'secret' };

      const result = await authService.signIn(dto);

      expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, fakeUser.passwordHash);
      expect(jwtService.sign).toHaveBeenCalledWith({
        jwtPayload: { username: fakeUser.username, id: fakeUser.id }
      });
      expect(result).toEqual({ token: 'jwt.token.example' });
    });

    it('should throw UnauthorizedException, if auth was not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const dto = { username: 'notfound', password: 'secret' };

      await expect(authService.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException, if passwords don`t match', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(fakeUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      const dto = { username: 'test_user', password: 'wrong_password' };

      await expect(authService.signIn(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should throw BadRequestException, if passwords don`t match', async () => {
      const dto = { username: 'new_user', password: 'secret', repeatPassword: 'secret1' };

      await expect(authService.signUp(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException, if auth with this username is already exists', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(fakeUser);
      const dto = { username: 'test_user', password: 'secret', repeatPassword: 'secret' };

      await expect(authService.signUp(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create a new auth and return AccessTokenDto', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      (userRepository.save as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          id: 'new-uuid',
          username: 'new_user',
          passwordHash: 'hashed_password'
        })
      );

      (userMapper.toEntity as jest.Mock).mockResolvedValue({
        username: 'new_user',
        passwordHash: 'hashed_password'
      });

      jest.spyOn(authService, 'signIn').mockResolvedValue(new AccessTokenDto('mocked.jwt.token'));

      const dto = { username: 'new_user', password: 'secret', repeatPassword: 'secret' };

      const result = await authService.signUp(dto);

      expect(userMapper.toEntity).toHaveBeenCalledWith(dto);
      expect(userRepository.save).toHaveBeenCalled();
      expect(authService.signIn).toHaveBeenCalledWith({ username: 'new_user', password: 'secret' });
      expect(result).toEqual({ token: 'mocked.jwt.token' });
    });
  });
});
