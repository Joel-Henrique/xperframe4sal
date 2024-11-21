import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entity/user.entity';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
//import * as crypto from 'crypto';
@Injectable()
export class User2Service {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({where: {_id: id}});
      if (!user) {
        throw new NotFoundException(
          `Não foi possível encontrar usuário com id: ${id}`,
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({where: {email}});
      if (!user) {
        throw new NotFoundException(
          `Não foi possível encontrar usuário com email: ${email}`,
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndPassword({email, password}): Promise<User> {
    try {
      const user = await this.findOneByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
