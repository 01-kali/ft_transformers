import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TaskStatus } from './task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus; 
  
  @IsString()
  @IsOptional()
  priority?: string;

  @IsInt()
  @IsOptional()
  projectId?: number;

  @IsInt()
  @IsOptional()
  createdBy?: number;

  @IsInt()
  @IsOptional()
  assignedTo?: number;
}
