import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  text: string;
}

export class QuestionDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsIn(['short-text', 'boolean', 'multiple-choice'])
  @ApiProperty()
  type: 'short-text' | 'boolean' | 'multiple-choice';

  @IsOptional()
  @ApiProperty({ required: false })
  answer?: string | number | boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  placeholder?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @ApiProperty({ type: [OptionDto], required: false })
  options?: OptionDto[];
}