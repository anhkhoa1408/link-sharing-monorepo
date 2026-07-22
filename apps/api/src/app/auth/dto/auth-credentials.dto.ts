import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { AuthCredentials } from '@link-sharing/shared-models';

export class AuthCredentialsDto implements AuthCredentials {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
