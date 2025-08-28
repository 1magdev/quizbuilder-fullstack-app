import { Module } from '@nestjs/common';

import { QuizController } from './quiz/quiz.controller';
import { QuizModule } from './quiz/quiz.module';
import { QuizService } from './quiz/quiz.service';
import { PrismaProvider } from './shared/prisma/prisma.provider';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, QuizModule],
  controllers: [QuizController],
  providers: [PrismaProvider, QuizService],
})
export class AppModule {}
