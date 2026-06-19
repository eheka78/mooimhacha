import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateExtensionDto {
  @ApiPropertyOptional({ description: 'change | delete (기본값 change)' })
  @IsOptional()
  @IsString()
  @IsIn(['change', 'delete'])
  type?: 'change' | 'delete';

  @ApiPropertyOptional({ description: '새 마감일 (ISO datetime)' })
  @IsOptional()
  @IsDateString()
  requested_due_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  requested_description?: string;

  @ApiPropertyOptional({ description: '난이도 1~3' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  requested_difficulty?: number;

  @ApiPropertyOptional({ description: '새 담당자 user_id. -1이면 담당자 해제' })
  @IsOptional()
  @IsInt()
  requested_assignee_id?: number | null;

  @ApiProperty({ example: '추가 자료 조사가 더 필요합니다.' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  reason!: string;
}
