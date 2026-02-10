import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaClient } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  prisma = new PrismaClient();

  constructor(private tasksGateway: TasksGateway) {}

  async findAll() {
    return await this.prisma.task.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description || '',
        status: createTaskDto.status,
        priority: createTaskDto.priority || 'Medium',
        project_id: createTaskDto.projectId || 1,
        created_by: createTaskDto.createdBy || 1,
        position: 0,
        assigned_to: createTaskDto.assignedTo || null,
      },
    });

    this.tasksGateway.broadcastTaskCreated(task);

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const { assignedTo, ...rest } = updateTaskDto;
      const dataToUpdate: any = { ...rest };

      if (assignedTo !== undefined) {
        dataToUpdate.assigned_to = assignedTo;
      }

      const task = await this.prisma.task.update({
        where: { id: id },
        data: dataToUpdate,
      });

      this.tasksGateway.broadcastTaskUpdated(task);

      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  async reorder(taskIds: number[]) {
    const updates = taskIds.map((id, index) => {
      return this.prisma.task.update({
        where: { id },
        data: { position: index },
      });
    });

    const results = await this.prisma.$transaction(updates);
    results.forEach((task) => this.tasksGateway.broadcastTaskUpdated(task));
    return results;
  }

  async remove(id: number) {
    try {
      const task = await this.prisma.task.delete({
        where: { id: id },
      });

      this.tasksGateway.broadcastTaskDeleted(id);

      return task;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }
}
