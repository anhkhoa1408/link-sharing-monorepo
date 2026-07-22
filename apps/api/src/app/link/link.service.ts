import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Platform, Prisma } from '../../generated/prisma/client';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinkResponseDto } from './dto/link-response.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {
  INVALID_LINK_URL,
  LINK_ALREADY_EXISTS,
  LINK_NOT_FOUND,
  PLATFORM_HOSTS,
} from './link.constants';
import { LinkRepository } from './link.repository';

@Injectable()
export class LinkService {
  constructor(private readonly links: LinkRepository) {}

  create(userId: string, input: CreateLinkDto): Promise<LinkResponseDto> {
    return this.callPersistence(() =>
      this.links.create(userId, {
        platform: input.platform,
        url: this.normalizeUrl(input.platform, input.url),
      }),
    );
  }

  findAll(userId: string): Promise<LinkResponseDto[]> {
    return this.links.findAllByUserId(userId);
  }

  async findOne(userId: string, id: string): Promise<LinkResponseDto> {
    const link = await this.links.findOneOwned(id, userId);

    if (!link) {
      throw new NotFoundException(LINK_NOT_FOUND);
    }

    return link;
  }

  update(
    userId: string,
    id: string,
    input: UpdateLinkDto,
  ): Promise<LinkResponseDto> {
    return this.callPersistence(() =>
      this.links.updateOwned(id, userId, {
        platform: input.platform,
        url: this.normalizeUrl(input.platform, input.url),
      }),
    );
  }

  remove(userId: string, id: string): Promise<void> {
    return this.callPersistence(() => this.links.deleteOwned(id, userId));
  }

  private normalizeUrl(platform: Platform, value: string): string {
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      throw new BadRequestException(INVALID_LINK_URL);
    }

    const hostname = url.hostname.toLowerCase();
    const matchesPlatform = PLATFORM_HOSTS[platform].some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    if (url.protocol !== 'https:' || !matchesPlatform) {
      throw new BadRequestException(INVALID_LINK_URL);
    }

    return url.toString();
  }

  private async callPersistence<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(LINK_ALREADY_EXISTS);
        }

        if (error.code === 'P2025') {
          throw new NotFoundException(LINK_NOT_FOUND);
        }
      }

      throw error;
    }
  }
}
