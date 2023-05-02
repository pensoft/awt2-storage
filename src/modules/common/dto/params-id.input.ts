import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ParamIdInput {
  @ApiModelProperty()
  @IsNotEmpty()
  @Transform(value => String(value))
  public id: string;
}
