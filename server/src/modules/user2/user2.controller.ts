import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {User2Service} from './user2.service';
import {
  ForgotPasswordDto,
  GetRecoveryPasswordDto,
  GetUserDto,
  ResetPasswordDto,
} from 'src/model/user.dto';
import {User} from './entity/user.entity';

@Controller('user2')
export class User2Controller {
  constructor(private readonly _userService: User2Service) {}

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    try {
      await this._userService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      throw error;
    }
  }
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    try {
      await this._userService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @Post()
  async create(@Body() user: User): Promise<GetUserDto> {
    try {
      user.name = user.name.trim();
      user.lastName = user.lastName.trim();
      user.email = user.email.trim();
      const userDto = await this._userService.create(user);
      return {
        id: userDto._id,
        name: userDto.name,
        lastName: userDto.lastName,
        email: userDto.email,
      };
    } catch (error) {
      throw error;
    }
  }
  //@UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('email') email: string,
  ): Promise<
    | GetUserDto[]
    | GetUserDto
    | {data?: any; error?: string; statusCode?: number}
  > {
    if (email) {
      try {
        const user = await this._userService.findOneByEmail(email);
        return {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        };
      } catch (error) {
        if (error instanceof NotFoundException) {
          return {error: 'Usuário não encontrado', statusCode: 404};
        } else {
          throw error;
        }
      }
    }
    try {
      const users = await this._userService.findAll();
      return users.map((user) => {
        return {
          id: user._id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  //@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<GetUserDto> {
    //user.lastChangedAt = new Date();
    const userDto = await this._userService.update(id, user);
    return {
      id: userDto._id,
      name: userDto.name,
      lastName: userDto.lastName,
      email: userDto.email,
    };
  }
  //@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this._userService.remove(id);
  }
  //@UseGuards(AuthGuard('jwt'))
  @Patch()
  async addChangesPasswordToken(
    @Query('email') email: string,
  ): Promise<GetRecoveryPasswordDto> {
    const user = await this._userService.addChangesPasswordToken(email);
    return {
      id: user._id,
      recoveryPasswordToken: user.recoveryPasswordToken,
      recoveryPasswordTokenExpirationDate:
        user.recoveryPasswordTokenExpirationDate,
    };
  }
}