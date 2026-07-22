import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  AVATAR_NOT_FOUND,
  AVATAR_SIGNED_URL_TTL_SECONDS,
  AVATAR_STORAGE_UNAVAILABLE,
} from './avatar.constants';
import { AvatarStorageError } from './avatar.errors';
import { AvatarRepository } from './avatar.repository';
import { AvatarFile } from './avatar.types';
import { AvatarResponseDto } from './dto/avatar-response.dto';

@Injectable()
export class AvatarService {
  constructor(private readonly avatars: AvatarRepository) {}

  async upload(
    userId: string,
    file: AvatarFile,
  ): Promise<AvatarResponseDto> {
    const path = this.getPath(userId);
    await this.callStorage(() => this.avatars.upload(path, file));

    const expiresAt = this.getExpiresAt();
    const avatarUrl = await this.callStorage(() =>
      this.avatars.createSignedUrl(path),
    );

    if (!avatarUrl) {
      throw new ServiceUnavailableException(AVATAR_STORAGE_UNAVAILABLE);
    }

    return this.createResponse(avatarUrl, expiresAt);
  }

  async get(userId: string): Promise<AvatarResponseDto> {
    const expiresAt = this.getExpiresAt();
    const avatarUrl = await this.callStorage(() =>
      this.avatars.createSignedUrl(this.getPath(userId)),
    );

    if (!avatarUrl) {
      throw new NotFoundException(AVATAR_NOT_FOUND);
    }

    return this.createResponse(avatarUrl, expiresAt);
  }

  private getPath(userId: string): string {
    return `${userId}/avatar`;
  }

  private getExpiresAt(): string {
    return new Date(
      Date.now() + AVATAR_SIGNED_URL_TTL_SECONDS * 1_000,
    ).toISOString();
  }

  private createResponse(
    avatarUrl: string,
    expiresAt: string,
  ): AvatarResponseDto {
    return {
      avatarUrl,
      expiresAt,
    };
  }

  private async callStorage<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof AvatarStorageError) {
        throw new ServiceUnavailableException(AVATAR_STORAGE_UNAVAILABLE);
      }

      throw error;
    }
  }
}
