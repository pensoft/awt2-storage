import { Injectable } from '@nestjs/common';
import { getYDoc } from 'y-websocket/bin/utils';
const waitYdocLoaded = require('../../../common/utils/helpers.js').waitYdocLoaded;
const getYdocData = require('../../../common/utils/helpers.js').getYdocData;
import { ArticleServiceErrors } from '@article/errors/article.service.errors';

@Injectable()
export class ArticleService {

  constructor(private readonly errors: ArticleServiceErrors) {
  }

  public async extractArticle(articleId): Promise<any>
  {
    let doc = getYDoc(articleId,true);
    let loaded = await waitYdocLoaded(doc);
    if(!loaded) {
      return this.errors.NOT_FOUND()
    }
    return getYdocData(doc);
  }
}
