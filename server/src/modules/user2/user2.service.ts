import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './entity/user.entity';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {ForgotPasswordDto, ResetPasswordDto} from 'src/model/user.dto';
import * as crypto from 'crypto';
import {MailerService} from '@nestjs-modules/mailer';

const HOUR_1 = 3600000;
@Injectable()
export class User2Service {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const {email} = forgotPasswordDto;
    let user = null;
    try {
      user = await this.findOneByEmail(email);
    } catch (error) {
      throw error;
    }
    user.recoveryPasswordToken = crypto.randomBytes(20).toString('hex');
    user.recoveryPasswordTokenExpirationDate = new Date(Date.now() + HOUR_1);
    try {
      await this.userRepository.update(user._id, {
        recoveryPasswordToken: user.recoveryPasswordToken,
        recoveryPasswordTokenExpirationDate:
          user.recoveryPasswordTokenExpirationDate,
      });
    } catch (error) {
      throw new HttpException(
        `Ocorreu um erro inesperado tente novamente`,
        500,
      );
    }
    try {
      await this.sendResetPasswordEmail(user.email, user.recoveryPasswordToken);
    } catch (error) {
      throw new HttpException(
        `Ocorreu um errro inesperado tente novamente`,
        500,
      );
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const user = await this.findOneByEmail(resetPasswordDto.email);
      if (
        user.recoveryPasswordToken &&
        user.recoveryPasswordToken !== resetPasswordDto.token
      ) {
        throw new Error('Token inválido');
      }
      if (user.recoveryPasswordTokenExpirationDate < new Date()) {
        throw new Error('Token expirado');
      }
      user.password = resetPasswordDto.password;
      user.recoveryPasswordToken = null;
      user.recoveryPasswordTokenExpirationDate = null;
      await this.update(user._id, user);
    } catch (error) {
      throw error;
    }
  }
  async create(user: User): Promise<User> {
    try {
      user.password = await bcrypt.hash(user.password, 10);
      const userSaved = await this.userRepository.save(user);
      return userSaved;
    } catch (error) {
      throw error;
    }
  }
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
  async addChangesPasswordToken(email: string): Promise<User> {
    const user = await this.findOneByEmail(email);
    const token = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 30);
    user.recoveryPasswordToken = token;
    user.recoveryPasswordTokenExpirationDate = expirationDate;
    return await this.update(user._id, user);
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
  async update(id: string, user: User): Promise<User> {
    try {
      if (user.password?.length > 0) {
        user.password = await bcrypt.hash(user.password, 10);
      } else {
        user.password = undefined;
      }
      await this.userRepository.update(id, user);
      const result = await this.findOne(id);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
  async removeAll() {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .execute();

      return {n: result.affected || 0};
    } catch (error) {
      throw error;
    }
  }
  private async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MY_GMAIL_EMAIL,
        subject: 'Alteração de Senha plataforma Buscando e Aprendendo',
        text: `Por favor, acesse o link a seguir para restaurar sua senha: https://buscandoeaprendendo.onrender.com/reset-password?token=${token}&email=${email}`,
        html: `Por favor, acesse o link a seguir para restaurar sua senha: <a href='https://buscandoeaprendendo.onrender.com/reset-password?token=${token}&email=${email}'>https://buscandoeaprendendo.onrender.com/reset-password?token=${token}</a>`,
      });
    } catch (error) {
      throw error;
    }
  }
}
