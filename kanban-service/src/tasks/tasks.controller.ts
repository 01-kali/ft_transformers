import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksGateway } from './tasks.gateway';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksGateway
  ) {}

  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    this.tasksGateway.broadcastTaskCreated(task);
    return task;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    const updatedTask = await this.tasksService.update(id, updateTaskDto);
    this.tasksGateway.server.emit('task:updated', updatedTask);
    return updatedTask;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
    this.tasksGateway.server.emit('task:deleted', { id });
    return { message: `Task ${id} deleted` };
  }
}
