import type { UpdateProfile } from '@link-sharing/shared-models';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateProfileDto implements UpdateProfile {
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;
}
