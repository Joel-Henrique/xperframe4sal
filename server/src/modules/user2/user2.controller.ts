import {Controller, Get, NotFoundException, Query} from '@nestjs/common';
import {User2Service} from './user2.service';
import {GetUserDto} from 'src/model/user.dto';

@Controller('user2')
export class User2Controller {
  constructor(private readonly _userService: User2Service) {}

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
}
