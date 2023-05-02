import { Module } from '@nestjs/common';
import { ArticleController } from './controllers/article.controller';
import { ArticleService } from '@app/modules/article/services/article.service';
import { ArticleServiceErrors } from '@app/modules/article/errors/article.service.errors';

@Module({
  imports: [],
  providers: [
    ArticleService,
    ArticleServiceErrors
  ],
  controllers: [ArticleController]
})
export class ArticleModule {}
