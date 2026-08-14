import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TicketPriority, TicketStatus } from '../entity/ticket.entity';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}

export class UpdateTicketDto extends PartialType(
  OmitType(CreateTicketDto, ['userId'] as const),
) {}
