import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(readonly service: QuizService) {}

  @ApiBody({ type: CreateQuizDto })
  @Post('/')
  async create(@Body() payload: CreateQuizDto) {
    return await this.service.create(payload);
  }

  @Get('/')
  async getAll() {
    return await this.service.getAll();
  }
  @ApiParam({ name: 'id', type: Number })
  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.service.getById(id);
  }
  @ApiParam({ name: 'id', type: Number })
  @Delete('/:id')
  async deleteById(@Param('id') id: number) {
    return await this.service.delete(id);
  }
}
