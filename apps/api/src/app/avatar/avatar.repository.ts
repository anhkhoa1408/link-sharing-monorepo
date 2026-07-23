import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageApiError } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import { AVATAR_SIGNED_URL_TTL_SECONDS } from './constants/avatar.constants';
import { AvatarStorageError } from './errors/avatar.errors';
import { AvatarFile } from './types/avatar.types';

@Injectable()
export class AvatarRepository {
  private readonly logger = new Logger(AvatarRepository.name);
  private readonly bucket: string;

  constructor(
    config: ConfigService,
    private readonly supabase: SupabaseService,
  ) {
    this.bucket = config.getOrThrow<string>('SUPABASE_AVATARS_BUCKET');
  }

  async upload(path: string, file: AvatarFile): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucket)
        .upload(path, file.buffer, {
          cacheControl: String(AVATAR_SIGNED_URL_TTL_SECONDS),
          contentType: file.mimetype,
          upsert: true,
      });

      if (error) {
        this.logStorageError('upload', error);
        throw new AvatarStorageError();
      }
    } catch (error) {
      this.rethrowStorageError(error);
    }
  }

  async createSignedUrl(path: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucket)
        .createSignedUrl(path, AVATAR_SIGNED_URL_TTL_SECONDS);

      if (error) {
        if (error instanceof StorageApiError && error.statusCode === '404') {
          return null;
        }

        this.logStorageError('create signed URL', error);
        throw new AvatarStorageError();
      }

      return data.signedUrl;
    } catch (error) {
      this.rethrowStorageError(error);
    }
  }

  private rethrowStorageError(error: unknown): never {
    if (error instanceof AvatarStorageError) {
      throw error;
    }

    this.logger.error(`Avatar storage request failed: ${String(error)}`);
    throw new AvatarStorageError();
  }

  private logStorageError(
    operation: string,
    error: {
      message: string;
      status?: number;
      statusCode?: string;
    },
  ): void {
    this.logger.error(
      `Avatar ${operation} failed: ${error.message} ` +
        `(status=${error.status}, code=${error.statusCode})`,
    );
  }
}
