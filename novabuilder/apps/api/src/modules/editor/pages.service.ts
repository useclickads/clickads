import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.client.page.findUnique({ where: { id } });
  }
}
