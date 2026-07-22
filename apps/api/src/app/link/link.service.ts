import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { LinkResponseDto } from './dto/link-response.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {
  INVALID_LINK_URL,
  LINK_ALREADY_EXISTS,
  LINK_NOT_FOUND,
} from './constants/link.constants';
import {
  InvalidLinkUrlError,
  LinkAlreadyExistsError,
  LinkNotFoundError,
} from './errors/link.errors';
import { LinkRepository } from './link.repository';
import { validateAndNormalizeLinkUrl } from './validators/link-url.validator';

@Injectable()
export class LinkService {
  constructor(private readonly links: LinkRepository) {}

  create(userId: string, input: CreateLinkDto): Promise<LinkResponseDto> {
    return this.callRepository(() =>
      this.links.create(userId, {
        platform: input.platform,
        url: validateAndNormalizeLinkUrl(input.platform, input.url),
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
    return this.callRepository(() =>
      this.links.updateOwned(id, userId, {
        platform: input.platform,
        url: validateAndNormalizeLinkUrl(input.platform, input.url),
      }),
    );
  }

  remove(userId: string, id: string): Promise<void> {
    return this.callRepository(() => this.links.deleteOwned(id, userId));
  }

  private async callRepository<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof InvalidLinkUrlError) {
        throw new BadRequestException(INVALID_LINK_URL);
      }

      if (error instanceof LinkAlreadyExistsError) {
        throw new ConflictException(LINK_ALREADY_EXISTS);
      }

      if (error instanceof LinkNotFoundError) {
        throw new NotFoundException(LINK_NOT_FOUND);
      }

      throw error;
    }
  }
}
