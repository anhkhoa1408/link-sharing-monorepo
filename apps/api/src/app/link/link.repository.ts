import { Injectable } from '@nestjs/common';
import { Platform, type Link } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface LinkData {
  platform: Platform;
  url: string;
}

@Injectable()
export class LinkRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, data: LinkData): Promise<Link> {
    return this.prisma.link.create({ data: { userId, ...data } });
  }

  findAllByUserId(userId: string): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: [{ platform: 'asc' }, { createdAt: 'asc' }],
    });
  }

  findOneOwned(id: string, userId: string): Promise<Link | null> {
    return this.prisma.link.findFirst({ where: { id, userId } });
  }

  updateOwned(id: string, userId: string, data: LinkData): Promise<Link> {
    return this.prisma.link.update({ where: { id, userId }, data });
  }

  async deleteOwned(id: string, userId: string): Promise<void> {
    await this.prisma.link.delete({ where: { id, userId } });
  }
}
