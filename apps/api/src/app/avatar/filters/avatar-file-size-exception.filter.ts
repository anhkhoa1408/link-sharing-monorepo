import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Response } from 'express';
import { AVATAR_FILE_TOO_LARGE } from '../constants/avatar.constants';

@Catch(PayloadTooLargeException)
export class AvatarFileSizeExceptionFilter
  implements ExceptionFilter<PayloadTooLargeException>
{
  catch(_exception: PayloadTooLargeException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: AVATAR_FILE_TOO_LARGE,
      error: 'Bad Request',
    });
  }
}
