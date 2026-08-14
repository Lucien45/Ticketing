import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  ticketId: string;

  @IsUUID()
  authorId: string;
}

export class UpdateCommentDto extends PartialType(
  OmitType(CreateCommentDto, ['ticketId', 'authorId'] as const),
) {}
