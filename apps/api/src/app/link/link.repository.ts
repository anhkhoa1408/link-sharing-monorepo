import { Injectable } from '@nestjs/common';
import { Prisma, type Link } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  LinkAlreadyExistsError,
  LinkNotFoundError,
} from './errors/link.errors';
import { LinkData } from './types/link.types';

@Injectable()
export class LinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, data: LinkData): Promise<Link> {
    return this.callPrisma(() =>
      this.prisma.link.create({ data: { userId, ...data } }),
    );
  }

  findAllByUserId(userId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: [{ platform: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  findOneOwned(id: string, userId: string): Promise<Link | null> {
    return this.prisma.link.findFirst({ where: { id, userId } });
  }

  updateOwned(id: string, userId: string, data: LinkData): Promise<Link> {
    return this.callPrisma(() =>
      this.prisma.link.update({ where: { id, userId }, data }),
    );
  }

  deleteOwned(id: string, userId: string): Promise<void> {
    return this.callPrisma(async () => {
      await this.prisma.link.delete({ where: { id, userId } });
    });
  }

  private async callPrisma<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new LinkAlreadyExistsError();
        }

        if (error.code === 'P2025') {
          throw new LinkNotFoundError();
        }
      }

      throw error;
    }
  }
}
