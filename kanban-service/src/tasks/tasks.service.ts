import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  prisma = new PrismaClient();

  async findAll() {
    return await this.prisma.task.findMany({
      orderBy: { id: 'asc' }
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        project_id: createTaskDto.projectId,
        status: 'TODO',
        position: 1,
        created_by: 1
      },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id: id },
        data: { ...updateTaskDto },
      });
    } catch (error) {
      // P2025 is Prisma's code for "Record not found"
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

async remove(id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }
}
