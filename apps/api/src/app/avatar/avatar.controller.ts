import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedPrincipal } from '../auth/strategies/jwt.strategy';
import {
  AVATAR_FILE_FIELD,
  AVATAR_MAX_FILE_SIZE_BYTES,
} from './avatar.constants';
import { AvatarFileSizeExceptionFilter } from './avatar-file-size-exception.filter';
import { AvatarMimeTypeValidator } from './avatar-mime-type.validator';
import { AvatarService } from './avatar.service';
import { AvatarFile } from './avatar.types';
import { AvatarResponseDto } from './dto/avatar-response.dto';

interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

@Controller('users/me/avatar')
@UseGuards(JwtAuthGuard)
export class AvatarController {
  constructor(private readonly avatars: AvatarService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseFilters(AvatarFileSizeExceptionFilter)
  @UseInterceptors(
    FileInterceptor(AVATAR_FILE_FIELD, {
      limits: {
        fields: 0,
        fileSize: AVATAR_MAX_FILE_SIZE_BYTES,
        files: 1,
      },
    }),
  )
  upload(
    @Req() request: AuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new AvatarMimeTypeValidator(),
        ],
      }),
    )
    file: AvatarFile,
  ): Promise<AvatarResponseDto> {
    return this.avatars.upload(request.user.claims.sub, file);
  }

  @Get()
  get(@Req() request: AuthenticatedRequest): Promise<AvatarResponseDto> {
    return this.avatars.get(request.user.claims.sub);
  }
}
