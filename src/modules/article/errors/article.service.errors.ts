import { NotFoundException } from '@nestjs/common';

export class ArticleServiceErrors {

  public NOT_FOUND(): never {
    throw new NotFoundException(`Ydoc could not load.`);
  }
}
