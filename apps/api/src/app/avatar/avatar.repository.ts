import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { AVATAR_SIGNED_URL_TTL_SECONDS } from './constants/avatar.constants';
import { AvatarStorageError } from './errors/avatar.errors';
import { AvatarFile } from './types/avatar.types';

@Injectable()
export class AvatarRepository {
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
        throw new AvatarStorageError();
      }
    } catch (error) {
      this.rethrowStorageError(error);
    }
  }

  async createSignedUrl(path: string): Promise<string | null> {
    try {
      const bucket = this.supabase.storage.from(this.bucket);
      const { data: exists } = await bucket.exists(path);

      if (!exists) {
        const { error } = await this.supabase.storage.getBucket(this.bucket);

        if (error) {
          throw new AvatarStorageError();
        }

        return null;
      }

      const { data, error } = await bucket.createSignedUrl(
        path,
        AVATAR_SIGNED_URL_TTL_SECONDS,
      );

      if (error) {
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

    throw new AvatarStorageError();
  }
}
