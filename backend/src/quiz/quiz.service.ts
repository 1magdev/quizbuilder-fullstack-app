import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaProvider } from 'src/shared/prisma/prisma.provider';
import { QuizPayload } from './types/quiz-payload';

@Injectable()
export class QuizService {
  constructor(readonly prisma: PrismaProvider) {}

  async create(quizPayload: any) {
    try {
      const data = await this.prisma.quizzes.create({
        data: {
          name: quizPayload.name,
          description: quizPayload.description,
          questions: quizPayload.questions as any,
        },
      });
      return data;
    } catch (e) {
      console.error('ERROR: ', e);
      throw new InternalServerErrorException('Error during quiz creation');
    }
  }
  async getAll() {
    try {
      const data = await this.prisma.quizzes.findMany();
      return data;
    } catch (e) {
      console.error('ERROR: ', e);
      throw new InternalServerErrorException('Error during quiz request');
    }
  }

  async getById(quizId: number) {
    try {
      if (!quizId) {
        throw new BadRequestException('Id parameter is required');
      }

      const data = await this.prisma.quizzes.findUnique({
        where: { id: quizId },
      });
      
      
      return data;
    } catch (e) {
      console.error('ERROR: ', e);
      throw new InternalServerErrorException('Error during quiz request');
    }
  }

  async delete(quizId: number) {
    try {
      if (!quizId) {
        throw new BadRequestException('Id parameter is required');
      }

      const data = await this.prisma.quizzes.delete({
        where: { id: quizId },
      });
      return data;
    } catch (e) {
      console.error('ERROR: ', e);
      throw new InternalServerErrorException('Error during quiz deletion');
    }
  }
}
