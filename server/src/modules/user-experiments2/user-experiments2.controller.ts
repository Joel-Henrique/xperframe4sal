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
