import { Controller, Get, Param, Post } from '@nestjs/common';
import { ParamIdInput } from '@app/modules/common/dto/params-id.input';
import { ArticleService } from '@article/services/article.service';
import { ApiCreatedResponse, ApiOAuth2, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { object } from 'lib0';

@ApiTags('Article')
@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {
  }

  @ApiOAuth2([],'Auth2')
  @ApiOperation({ description: 'Get entire object from the storage' })
  @ApiCreatedResponse({
    description: "Successful operation"
  })
  @ApiResponse({
    status: 404,
    description: "Resource Not Found"
  })
  @Get('/:id')
  public async getArticleData(@Param() param: ParamIdInput): Promise<any> {
    return this.articleService.extractArticle(param.id);
  }
}
