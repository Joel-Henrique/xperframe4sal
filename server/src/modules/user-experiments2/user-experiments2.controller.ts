import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {UserExperiments2Service} from './user-experiments2.service';
import {CreateUserExperimentDto} from './dto/create-userExperiment.dto';
import {UserExperiment} from './entities/user-experiments.entity';
import {UpdateUserExperimentDto} from './dto/update-userExperiment.dto';
import {GetUserDto} from 'src/model/user.dto';
import {Experiment} from '../experiments2/entity/experiment.entity';

@Controller('user-experiments2')
export class UserExperiments2Controller {
  constructor(
    private readonly userExperimentService: UserExperiments2Service,
  ) {}

  //@UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createUserExperimentDto: CreateUserExperimentDto,
  ): Promise<UserExperiment> {
    return await this.userExperimentService.create(createUserExperimentDto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('userId') userId: string,
    @Query('experimentId') experimentId: string,
  ): Promise<UserExperiment[] | UserExperiment> {
    if (userId) {
      if (experimentId) {
        return await this.userExperimentService.findByUserAndExperimentId(
          userId,
          experimentId,
        );
      }
      return await this.userExperimentService.findByUserId(userId);
    }
    return await this.userExperimentService.findAll();
  }

  @Get('/experiment/:experimentId')
  async findUsersByExperimentId(
    @Param('experimentId') experimentId,
  ): Promise<GetUserDto[]> {
    const users =
      await this.userExperimentService.findUsersByExperimentId(experimentId);
    return users.map((user) => {
      return {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        researcher: user.researcher,
      };
    });
  }

  @Get('/user/:userId')
  async findExperimentsByUserId(
    @Param('userId') userId,
  ): Promise<Experiment[]> {
    const experiments =
      await this.userExperimentService.findExperimentsByUserId(userId);
    return experiments;
  }

  //@UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserExperimentDto: UpdateUserExperimentDto,
  ): Promise<UserExperiment> {
    const result = await this.userExperimentService.update(
      id,
      updateUserExperimentDto,
    );
    return result;
  }

  //@UseGuards(AuthGuard('jwt'))
  @Delete()
  async removeByUserAndExperimentId(
    @Query('userId') userId: string,
    @Query('experimentId') experimentId: string,
  ) {
    return await this.userExperimentService.removeByUserIdAndExperimentId(
      userId,
      experimentId,
    );
  }

  //@UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userExperimentService.remove(id);
  }
}
